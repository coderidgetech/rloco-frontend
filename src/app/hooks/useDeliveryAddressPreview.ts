import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { addressService } from '@/app/services/addressService';

/** Line for mobile headers: default or first saved address, or null if none / logged out. */
export function useDeliveryAddressPreview() {
  const { isAuthenticated } = useUser();
  const [line, setLine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLine(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await addressService.list();
        if (cancelled) return;
        const addr = list.find((a) => a.is_default) ?? list[0];
        if (!addr) {
          setLine(null);
          return;
        }
        const tail = [addr.address_line, addr.city, addr.state, addr.pincode]
          .filter(Boolean)
          .join(', ');
        setLine(tail ? `${addr.name} — ${tail}` : addr.name);
      } catch {
        if (!cancelled) setLine(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return { line, loading, isAuthenticated };
}
