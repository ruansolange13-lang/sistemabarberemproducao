import { BarbeariaTenant } from '../types';

/**
 * Standardizes navigation without page reloads using HTML5 History API.
 */
export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  const target = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname !== target) {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

/**
 * Normalizes a slug or path for tenant lookup.
 * Removes leading/trailing slashes and normalizes lowercase alphanumerics.
 */
export function normalizeSlug(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/^@/, '');
}

/**
 * Finds a tenant by slug or alias.
 * Supports:
 * - Direct match: 'barbearialupumba' === 'barbearialupumba'
 * - Id match: 'lupumba' === 'lupumba'
 * - Slug variations: 'lupumba' matches 'barbearialupumba'
 */
export function findTenantBySlug(
  tenants: BarbeariaTenant[],
  rawSlug: string
): BarbeariaTenant | undefined {
  const clean = normalizeSlug(rawSlug);
  if (!clean) return undefined;

  return tenants.find((t) => {
    const tenantSlug = normalizeSlug(t.slug);
    const tenantId = normalizeSlug(t.id);

    if (tenantSlug === clean || tenantId === clean) return true;

    // Fuzzy matching for prefixes like 'barbearia-'
    const strippedClean = clean.replace(/^barbearia-?/, '');
    const strippedTenantSlug = tenantSlug.replace(/^barbearia-?/, '');

    if (strippedClean && strippedTenantSlug && strippedClean === strippedTenantSlug) {
      return true;
    }

    return false;
  });
}

/**
 * Generates the official public URL for a tenant's Mini Central.
 * e.g. https://snakebarber.app/barbearialupumba
 */
export function getMiniCentralUrl(slug: string): string {
  const clean = normalizeSlug(slug);
  return `https://snakebarber.app/${clean}`;
}
