/**
 * Safe scroll helper respecting prefers-reduced-motion user preference
 */
export function scrollToElement(
  el: HTMLElement | null | undefined,
  options?: ScrollIntoViewOptions
): void {
  if (!el) return;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : (options?.behavior || 'smooth'),
    block: options?.block || 'start',
    inline: options?.inline || 'nearest',
  });
}
