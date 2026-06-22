export const HEADING_LEVEL_CLASSES: Record<number, string> = {
  1: 'text-3xl sm:text-4xl font-bold tracking-tight text-foreground',
  2: 'text-2xl sm:text-3xl font-bold tracking-tight text-foreground',
  3: 'text-xl sm:text-2xl font-semibold text-foreground',
  4: 'text-lg sm:text-xl font-semibold text-foreground/95',
  5: 'text-base sm:text-lg font-medium text-foreground/90',
  6: 'text-sm sm:text-base font-medium uppercase tracking-wider text-muted',
};

export function getHeadingClassName(level: number): string {
  return HEADING_LEVEL_CLASSES[level] ?? HEADING_LEVEL_CLASSES[2];
}
