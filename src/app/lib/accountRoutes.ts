export const ACCOUNT_SECTIONS = ['profile', 'orders', 'addresses', 'payment', 'wishlist', 'settings'] as const;

export type AccountSection = (typeof ACCOUNT_SECTIONS)[number];

export const ACCOUNT_DEFAULT_PATH = '/account/profile';

export function accountPath(section: AccountSection): string {
  return `/account/${section}`;
}

export function isAccountSection(s: string | undefined): s is AccountSection {
  return !!s && (ACCOUNT_SECTIONS as readonly string[]).includes(s);
}

/** True for `/account` or any `/account/...` storefront account URL. */
export function isAccountPath(pathname: string): boolean {
  return pathname === '/account' || pathname.startsWith('/account/');
}
