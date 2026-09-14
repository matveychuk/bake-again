export const ASSISTANT_SESSION_REQUESTS_PER_MINUTE = 5;
export const ASSISTANT_SESSION_REQUESTS_PER_DAY = 30;
export const ASSISTANT_NETWORK_REQUESTS_PER_MINUTE = 20;
const MAX_TRACKED_SESSION_BUCKETS = 10_000;
const MAX_TRACKED_NETWORK_BUCKETS = 5_000;
const SWEEP_INTERVAL = 128;

export type AssistantThrottleLease =
  | { allowed: true; release(): void }
  | { allowed: false; retryAfterSeconds: number };

export interface AssistantRequestThrottle {
  acquire(
    sessionIdentifier: string,
    networkIdentifier: string | null,
  ): AssistantThrottleLease;
}

type Bucket = { minute: number[]; day: number[]; inFlight: number };

/** Per-isolate fail-closed request throttle. A shared atomic store remains a rollout gate. */
export function createMemoryAssistantThrottle(
  now: () => number = Date.now,
): AssistantRequestThrottle {
  const sessions = new Map<string, Bucket>();
  const networks = new Map<string, number[]>();
  let acquisitions = 0;

  const prune = (timestamps: number[], cutoff: number) => {
    while (timestamps.length > 0 && timestamps[0]! <= cutoff)
      timestamps.shift();
  };

  const sweepExpiredBuckets = (current: number) => {
    const minuteCutoff = current - 60_000;
    const dayCutoff = current - 86_400_000;
    for (const [identifier, bucket] of sessions) {
      prune(bucket.minute, minuteCutoff);
      prune(bucket.day, dayCutoff);
      if (bucket.inFlight === 0 && bucket.day.length === 0)
        sessions.delete(identifier);
    }
    for (const [identifier, timestamps] of networks) {
      prune(timestamps, minuteCutoff);
      if (timestamps.length === 0) networks.delete(identifier);
    }
  };

  return {
    acquire(sessionIdentifier, networkIdentifier) {
      const current = now();
      acquisitions += 1;
      if (acquisitions % SWEEP_INTERVAL === 0) sweepExpiredBuckets(current);
      const minuteCutoff = current - 60_000;
      const dayCutoff = current - 86_400_000;
      const existingBucket = sessions.get(sessionIdentifier);
      if (!existingBucket && sessions.size >= MAX_TRACKED_SESSION_BUCKETS) {
        return { allowed: false, retryAfterSeconds: 60 };
      }
      const bucket = existingBucket ?? { minute: [], day: [], inFlight: 0 };
      prune(bucket.minute, minuteCutoff);
      prune(bucket.day, dayCutoff);

      const nextMinute = bucket.minute[0] ?? current;
      const nextDay = bucket.day[0] ?? current;
      if (
        bucket.inFlight >= 1 ||
        bucket.minute.length >= ASSISTANT_SESSION_REQUESTS_PER_MINUTE ||
        bucket.day.length >= ASSISTANT_SESSION_REQUESTS_PER_DAY
      ) {
        const retryAt = Math.max(
          bucket.inFlight >= 1 ? current + 1_000 : current,
          bucket.minute.length >= ASSISTANT_SESSION_REQUESTS_PER_MINUTE
            ? nextMinute + 60_000
            : current,
          bucket.day.length >= ASSISTANT_SESSION_REQUESTS_PER_DAY
            ? nextDay + 86_400_000
            : current,
        );
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((retryAt - current) / 1_000),
          ),
        };
      }

      let networkBucket: number[] | null = null;
      if (networkIdentifier) {
        const existingNetworkBucket = networks.get(networkIdentifier);
        if (
          !existingNetworkBucket &&
          networks.size >= MAX_TRACKED_NETWORK_BUCKETS
        ) {
          return { allowed: false, retryAfterSeconds: 60 };
        }
        networkBucket = existingNetworkBucket ?? [];
        prune(networkBucket, minuteCutoff);
        if (networkBucket.length >= ASSISTANT_NETWORK_REQUESTS_PER_MINUTE) {
          return {
            allowed: false,
            retryAfterSeconds: Math.max(
              1,
              Math.ceil((networkBucket[0]! + 60_000 - current) / 1_000),
            ),
          };
        }
      }

      bucket.minute.push(current);
      bucket.day.push(current);
      bucket.inFlight += 1;
      sessions.set(sessionIdentifier, bucket);
      if (networkIdentifier && networkBucket) {
        networkBucket.push(current);
        networks.set(networkIdentifier, networkBucket);
      }
      let released = false;
      return {
        allowed: true,
        release() {
          if (released) return;
          released = true;
          bucket.inFlight = Math.max(0, bucket.inFlight - 1);
        },
      };
    },
  };
}

export const assistantRequestThrottle = createMemoryAssistantThrottle();
