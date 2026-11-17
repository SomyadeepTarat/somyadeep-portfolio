import type { CSSProperties } from 'react';
export type IconName = 'about' | 'experience' | 'projects' | 'resume' | 'settings' | 'search' | 'sun' | 'moon' | 'mail' | 'arrow' | 'grid';
const paths: Record<IconName, string> = {
 about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2a8 8 0 0 1 16 0v2',
 experience: 'M3 7h18v14H3zM8 7V3h8v4M3 12c6 4 12 4 18 0M10 13h4',
 projects: 'M3 6h7l2 3h9v12H3zM3 6V3h7l2 3h8v3',
 resume: 'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8M8 19h5',
 settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
 search: 'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM16 16l5 5',
 sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
 moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
 mail: 'M3 5h18v14H3zM3 5l9 8 9-8', arrow: 'M5 19L19 5M5 5h14v14', grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'
};
export function Icon({name, size = 20}: {name: IconName; size?: number}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;}
export function AppIcon({name, small = false}: {name: IconName; small?: boolean}) {return <span className={`app-icon icon-${name} ${small ? 'small' : ''}`} style={{'--icon-color': ({about:'#629add',experience:'#bc8e65',projects:'#6ba5bc',resume:'#c77b7c',settings:'#8a94a6'} as Record<string,string>)[name]} as CSSProperties}><Icon name={name} size={small?21:30}/></span>;}
