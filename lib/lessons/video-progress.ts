export const videoMilestones = [10, 25, 50, 75, 90, 100] as const;
export const videoStartModes = ['autoplay', 'manual', 'continuous'] as const;
export const videoPlayers = ['native', 'stream'] as const;
export type VideoMilestone = (typeof videoMilestones)[number];
export type VideoStartMode = (typeof videoStartModes)[number];
export type VideoPlayer = (typeof videoPlayers)[number];

type Range = [start: number, end: number];
export type VideoCoverage = { ranges: Range[]; milestone: number };

/** Merge played ranges as fractions so source changes and replays do not inflate progress. */
export function updateVideoCoverage(
  coverage: VideoCoverage,
  played: TimeRanges,
  duration: number,
  ended = false,
) {
  if (!Number.isFinite(duration) || duration <= 0) return [];
  const ranges = [...coverage.ranges];
  for (let i = 0; i < played.length; i++) {
    const start = Math.max(0, played.start(i) / duration);
    const end = Math.min(1, played.end(i) / duration);
    if (Number.isFinite(start) && Number.isFinite(end) && end > start)
      ranges.push([start, end]);
  }
  coverage.ranges = [];
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
    const last = coverage.ranges.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(end, last[1]);
    else coverage.ranges.push([start, end]);
  }
  const fraction = coverage.ranges.reduce(
    (sum, [start, end]) => sum + end - start,
    0,
  );
  const watchedSeconds = Math.min(
    Math.round(duration),
    Math.round(fraction * duration),
  );
  const percent =
    ended && (1 - fraction) * duration <= 0.25
      ? 100
      : Math.min(99, fraction * 100);
  const reached = videoMilestones.filter(
    (point) => point <= percent && point > coverage.milestone,
  );
  if (reached.length) coverage.milestone = reached.at(-1)!;
  return reached.map((milestone) => ({ milestone, watchedSeconds }));
}
