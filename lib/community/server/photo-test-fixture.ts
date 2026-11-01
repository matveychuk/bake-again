import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import {
  PhotoAdmissionError,
  type PhotoAdmissionRepository,
} from './photo-admission.ts';
export const photoAuthor = {
  contributionId: '22222222-2222-4222-8222-222222222222',
  ownerHash: 'a'.repeat(64),
  checksPassed: true as const,
};
export const photoId = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
export async function photoDatabase() {
  const db = new PGlite();
  await db.exec(
    'CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;',
  );
  for (const name of [
    '20261031210000_community_probe.sql',
    '20261031223000_community_photo_admissions.sql',
    '20261101190000_community_reviews_public.sql',
  ])
    await db.exec(
      readFileSync(
        new URL(`../../../supabase/migrations/${name}`, import.meta.url),
        'utf8',
      ),
    );
  await db.query(
    `INSERT INTO bake_again_community.contributions
    (id,operation_id,recipe_id,recipe_version,configuration,display_name,body,kind,experience)
    VALUES ($1,$2,'community-probe','test-v1','base','Тест','Технічна проба','result','as-written')`,
    [photoAuthor.contributionId, photoId(100)],
  );
  await db.query(
    `INSERT INTO bake_again_community.guest_contacts
    (contribution_id,email,email_key,browser_key,owner_hash,fingerprint) VALUES ($1,'probe@example.invalid',$2,$2,$2,$2)`,
    [photoAuthor.contributionId, photoAuthor.ownerHash],
  );
  const rpc = async (
    action: string,
    input: unknown,
  ): Promise<Record<string, unknown>> => {
    await db.exec('SET ROLE service_role');
    try {
      return (
        await db.query<{ result: Record<string, unknown> }>(
          'SELECT public.community_photo_admission($1,$2::jsonb) AS result',
          [action, JSON.stringify(input)],
        )
      ).rows[0].result;
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      const codes: Record<string, number> = {
        UPLOAD_FORBIDDEN: 403,
        UPLOAD_EXPIRED: 410,
        UPLOAD_USED: 409,
        OPERATION_REUSED: 409,
        PHOTO_LIMIT: 429,
        RATE_LIMITED: 429,
      };
      if (codes[code]) throw new PhotoAdmissionError(code, codes[code]);
      throw error;
    } finally {
      await db.exec('RESET ROLE');
    }
  };
  const repository: PhotoAdmissionRepository = {
    async issue(command) {
      return (await rpc('issue', command)) as never;
    },
    async claim(id, hash) {
      return (await rpc('claim', { id, admission_hash: hash })) as never;
    },
    async complete(id, hash) {
      await rpc('complete', { id, admission_hash: hash });
    },
    async fail(id, hash) {
      await rpc('fail', { id, admission_hash: hash });
    },
  };
  const expire = async (id: string) => {
    await db.query(
      `UPDATE bake_again_community.photo_upload_admissions SET
      issued_at=now()-interval '121 seconds',expires_at=now()-interval '1 second' WHERE id=$1`,
      [id],
    );
  };
  return { db, rpc, repository, expire };
}
