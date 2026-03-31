import { defaultSiteConfig, type SiteConfig } from '../context/SiteConfigContext';
import { deepMerge } from './deepMerge';

/** Merge API config map with defaults for a full `SiteConfig`. */
export function mergeSiteConfigFromApi(raw: Record<string, unknown> | null): SiteConfig {
  const base = structuredClone(defaultSiteConfig) as unknown as Record<string, unknown>;
  return deepMerge(base, raw || {}) as unknown as SiteConfig;
}
