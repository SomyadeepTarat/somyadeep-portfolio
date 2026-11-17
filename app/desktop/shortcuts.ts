export const shortcuts = [
 { key: 'k', modifiers: true, label: '⌘ / Ctrl + K', description: 'Open Spotlight', action: 'search' },
 { key: 'w', modifiers: true, label: '⌘ / Ctrl + W', description: 'Close active window', action: 'close' },
 { key: 'm', modifiers: true, label: '⌘ / Ctrl + M', description: 'Minimize active window', action: 'minimize' },
 { key: '`', modifiers: true, label: '⌘ / Ctrl + `', description: 'Cycle windows', action: 'cycle' },
 { key: 'F3', modifiers: false, label: 'F3 / Ctrl + ↑', description: 'Mission Control', action: 'mission' },
 { key: '?', modifiers: false, label: '?', description: 'Keyboard Shortcuts', action: 'shortcuts' },
 { key: 'Escape', modifiers: false, label: 'Esc', description: 'Close the top overlay or window', action: 'escape' },
] as const;
export const windowShortcuts = [
 { label: 'Alt + Arrow', description: 'Move the focused window' },
 { label: 'Alt + Shift + Arrow', description: 'Resize the focused window' },
 { label: 'Space', description: 'Quick Look on a focused project' },
 { label: 'Tab / Shift + Tab', description: 'Move between controls' },
];
