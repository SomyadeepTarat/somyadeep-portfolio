'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { ui } from '../data/interface';
export default function Overlay({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
 const ref = useRef<HTMLDialogElement>(null);
 const closeRef = useRef(onClose);
 useEffect(() => { closeRef.current = onClose; }, [onClose]);
 useEffect(() => { const previous = document.activeElement as HTMLElement; ref.current?.showModal(); return () => previous?.focus(); }, []);
 return <dialog ref={ref} className={`workspace-overlay ${className}`} aria-label={title} onCancel={e => { e.preventDefault(); e.stopPropagation(); closeRef.current(); }} onClick={e => { if(e.target === e.currentTarget) onClose(); }}><header><h2>{title}</h2><button onClick={onClose} aria-label={ui.close}>×</button></header>{children}</dialog>;
}
