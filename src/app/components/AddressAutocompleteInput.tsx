/**
 * AddressAutocompleteInput – street-line suggestions; ZIP lookup uses Zippopotam.
 */

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { PH } from '../lib/formPlaceholders';
import { getGoogleMapsBrowserKey } from '../lib/mapsBrowserKey';

export interface AddressComponents {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Suggestion {
  id: string;
  label: string;          // one-line display
  sublabel: string;       // city, state, zip, country
  fill: () => Promise<AddressComponents> | AddressComponents;
}

// ─── Google Places ─────────────────────────────────────────────────────────────
let googleScriptLoaded = false;
let googleScriptLoading = false;
let scriptKeyLoaded: string | undefined;
const googleScriptCallbacks: Array<() => void> = [];

function loadGoogleScript(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    const key = apiKey.trim();
    if (!key) {
      resolve();
      return;
    }
    if (googleScriptLoaded && scriptKeyLoaded === key) {
      resolve();
      return;
    }
    googleScriptCallbacks.push(resolve);
    if (googleScriptLoading) return;
    googleScriptLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true;
    script.onload = () => {
      googleScriptLoaded = true;
      scriptKeyLoaded = key;
      googleScriptLoading = false;
      googleScriptCallbacks.forEach((cb) => cb());
      googleScriptCallbacks.length = 0;
    };
    script.onerror = () => {
      googleScriptLoading = false;
      googleScriptCallbacks.forEach((cb) => cb());
      googleScriptCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

async function fetchGoogleSuggestions(
  query: string,
  countryCode: string | undefined
): Promise<Suggestion[]> {
  const apiKey = await getGoogleMapsBrowserKey();
  if (!apiKey) return [];
  await loadGoogleScript(apiKey);
  const g = (window as any).google;
  if (!g?.maps?.places) return [];

  // Omit legacy `types: ['geocode']` — it often yields ZERO_RESULTS for street-level typing; optional country filter only.
  const options: { input: string; componentRestrictions?: { country: string } } = {
    input: query,
  };
  if (countryCode && countryCode.trim()) {
    options.componentRestrictions = { country: countryCode.trim().toLowerCase() };
  }

  return new Promise((resolve) => {
    const svc = new g.maps.places.AutocompleteService();
    svc.getPlacePredictions(
      options,
      (predictions: any[], status: string) => {
        const S = g.maps.places.PlacesServiceStatus;
        if (status === S.ZERO_RESULTS || !predictions) {
          resolve([]);
          return;
        }
        if (status !== S.OK) {
          if (import.meta.env.DEV) {
            console.warn('[AddressAutocomplete] Places getPlacePredictions:', status, {
              hint:
                status === S.REQUEST_DENIED
                  ? 'Check API key, billing, and enable Maps JavaScript API + Places API in Google Cloud.'
                  : undefined,
            });
          }
          resolve([]);
          return;
        }
        resolve(
          predictions.map((p) => ({
            id: p.place_id,
            label: p.structured_formatting?.main_text || p.description,
            sublabel: p.structured_formatting?.secondary_text || '',
            fill: () =>
              new Promise<AddressComponents>((res) => {
                const dummy = document.createElement('div');
                const placesSvc = new g.maps.places.PlacesService(dummy);
                placesSvc.getDetails(
                  { placeId: p.place_id, fields: ['address_components'] },
                  (place: any, s: string) => {
                    if (s !== g.maps.places.PlacesServiceStatus.OK || !place) {
                      res({ addressLine: p.description, city: '', state: '', pincode: '', country: '' });
                      return;
                    }
                    const get = (type: string) =>
                      place.address_components?.find((c: any) => c.types.includes(type))?.long_name || '';
                    const getShort = (type: string) =>
                      place.address_components?.find((c: any) => c.types.includes(type))?.short_name || '';
                    const streetNum = get('street_number');
                    const route     = get('route');
                    const postalCode = get('postal_code');
                    const postalCodeSuffix = get('postal_code_suffix');
                    const cCode = getShort('country');
                    const normalizedPostalCode =
                      cCode === 'US' && postalCode
                        ? (postalCodeSuffix ? `${postalCode}-${postalCodeSuffix}` : postalCode)
                        : [postalCode, postalCodeSuffix].filter(Boolean).join('-');
                    res({
                      addressLine: [streetNum, route].filter(Boolean).join(' ') || p.description.split(',')[0],
                      city:        get('locality') || get('sublocality') || get('administrative_area_level_2'),
                      state:       get('administrative_area_level_1'),
                      pincode:     normalizedPostalCode,
                      country:     get('country') || cCode,
                    });
                  }
                );
              }),
          }))
        );
      }
    );
  });
}

// ─── debounce helper ───────────────────────────────────────────────────────────
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (value: string) => void;
  onAddressFill: (components: AddressComponents) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  /** ISO-2 country code to restrict to one country (e.g. 'us', 'in'). Omit or leave empty for worldwide suggestions. */
  countryCode?: string;
}

export function AddressAutocompleteInput({
  value,
  onChange,
  onAddressFill,
  placeholder = PH.streetAddress,
  error,
  className = '',
  countryCode,
}: Props) {
  const menuId = useId().replace(/:/g, '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const [menuRect, setMenuRect]       = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const updateMenuRect = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuRect({ top: r.bottom, left: r.left, width: r.width });
  }, []);

  // Close dropdown on outside click (include portaled menu). Defer so mousedown on a suggestion runs first.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      queueMicrotask(() => setOpen(false));
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }
    updateMenuRect();
    const onScrollOrResize = () => updateMenuRect();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, suggestions, updateMenuRect]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      const q = query.trim();
      if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
      const key = await getGoogleMapsBrowserKey();
      if (!key) { setSuggestions([]); setOpen(false); return; }

      setLoading(true);
      try {
        const results = await fetchGoogleSuggestions(query, countryCode);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250),
    [countryCode]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    setLoading(true);
    setSuggestions([]);
    setOpen(false);
    try {
      const components = await suggestion.fill();
      onChange(components.addressLine);
      onAddressFill(components);
    } finally {
      setLoading(false);
    }
  };

  const provider = 'Google';

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-4 py-3 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
            error ? 'border-destructive' : 'border-border focus:border-primary'
          } ${className}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : <MapPin size={16} />}
        </div>
      </div>

      {open &&
        suggestions.length > 0 &&
        menuRect &&
        createPortal(
          <ul
            id={menuId}
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              top: menuRect.top + 4,
              left: menuRect.left,
              width: Math.max(menuRect.width, 200),
              zIndex: 99999,
            }}
            className="bg-background border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto"
          >
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(s);
                }}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/40 last:border-b-0"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.sublabel}</p>
                </div>
              </li>
            ))}
            <li className="px-4 py-1.5 text-[10px] text-muted-foreground/50 text-right select-none">
              Powered by {provider}
            </li>
          </ul>,
          document.body
        )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

// ─── ZIP → city + state lookup ─────────────────────────────────────────────────
/** Looks up city + state from a ZIP code.
 *  Uses Zippopotam.us (free, no key) for US; returns null on failure. */
export async function lookupZipCode(
  zip: string,
  countryCode = 'us'
): Promise<{ city: string; state: string } | null> {
  if (!zip || zip.length < 4) return null;
  try {
    // Try Zippopotam (US, CA, GB, AU + many more)
    const res = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return { city: place['place name'] || '', state: place['state'] || '' };
  } catch {
    return null;
  }
}
