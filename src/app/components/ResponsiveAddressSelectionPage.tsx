import { useIsMobile } from '@/app/hooks/useIsMobile';
import { AddressSelectionPage } from '@/app/pages/AddressSelectionPage';
import { MobileAddressSelectionPage } from '@/app/pages/mobile/MobileAddressSelectionPage';

export function ResponsiveAddressSelectionPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileAddressSelectionPage /> : <AddressSelectionPage />;
}
