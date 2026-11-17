import { apps, type AppId } from './registry';
import { projects, experience, profile, skills } from '../data/profile';
export type SearchResult = { id: AppId; label: string; category: string; selection?: string; terms?: string; action?: 'download' | 'theme' };
export const searchIndex: SearchResult[] = [
 ...apps.map(a => ({ id: a.id, label: a.name, category: 'Applications' })),
 ...projects.map(p => ({ id: 'projects' as const, label: p.name, category: 'Projects', selection: p.id, terms: `${p.subtitle} ${p.stack.join(' ')}` })),
 ...experience.map((e, i) => ({ id: 'experience' as const, label: `${e.company} · ${e.role}`, category: 'Experience', selection: e.id, terms: `${e.stack.join(' ')} ${i === 0 ? 'Latest role' : ''}` })),
 ...skills.flatMap(g => g.items.map(s => ({ id: 'skills' as const, label: s, category: 'Skills', selection: s, terms: g.category }))),
 { id: 'about', label: profile.education.institution, category: 'Education', selection: 'education', terms: profile.education.degree },
 { id: 'resume', label: 'Download resume', category: 'Quick actions', action: 'download' },
 { id: 'settings', label: 'Toggle dark mode', category: 'Quick actions', action: 'theme' },
 { id: 'mail', label: 'Contact', category: 'Quick actions' },
];
function score(query: string, text: string) {
 const q = query.toLowerCase().trim(), t = text.toLowerCase();
 if (t.includes(q)) return 100 - t.indexOf(q) / 100;
 let at = 0, gaps = 0;
 for (const c of q) { const n = t.indexOf(c, at); if (n < 0) return 0; gaps += n - at; at = n + 1; }
 return 50 - gaps / Math.max(1, q.length);
}
export function searchPortfolio(query: string) {
 return searchIndex.map((r, i) => ({ r, i, score: score(query, `${r.label} ${r.terms || ''}`) })).filter(x => x.score > 0).sort((a,b) => b.score-a.score || a.i-b.i).map(x => x.r);
}
