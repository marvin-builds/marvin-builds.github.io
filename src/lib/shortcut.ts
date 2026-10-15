// The palette button's label: ⌘K on Apple platforms, otherwise Ctrl K / Strg K (spec §5).
import type { Lang } from './experience';

export const isApple = (platform: string) => /mac|iphone|ipad/i.test(platform);

export const shortcutLabel = (platform: string, lang: Lang) => (isApple(platform) ? '⌘K' : lang === 'de' ? 'Strg K' : 'Ctrl K');
