import { headers } from 'next/headers';
import { isLocalDevelopment } from './local-development';

export async function canViewDrafts(): Promise<boolean> {
  return isLocalDevelopment((await headers()).get('host'), process.env.NODE_ENV);
}
