import { apps, type AppId } from './registry';
import { projects, experience, skills } from '../data/profile';
export function routeHash(id: AppId, selection?: string) { return `#/${id}${selection ? '/' + encodeURIComponent(selection) : ''}`; }
export function parseRoute(hash: string): { id: AppId; selection?: string } | null {
  try {
    const [id, selection, extra] = hash.replace(/^#\//, '').split('/').map(decodeURIComponent);
    if (extra || !apps.some(a => a.id === id)) return null;
    if (selection && id === 'projects' && !projects.some(p => p.id === selection)) return null;
    if (selection && id === 'experience' && selection !== 'highlights' && !experience.some(e => e.id === selection)) return null;
    if (selection && id === 'skills' && !skills.some(g => g.category === selection || g.items.includes(selection))) return null;
    return { id: id as AppId, selection };
  } catch { return null; }
}
export function navigateHash(id: AppId, selection?: string) {
  const hash = routeHash(id, selection);
  if (location.hash !== hash) history.pushState(null, '', hash);
}
export async function copyLink(id: AppId, selection?: string) {
  const url = new URL(location.href); url.hash = routeHash(id, selection);
  await navigator.clipboard.writeText(url.href);
}
