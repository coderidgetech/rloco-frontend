import { useIsMobile } from '@/app/hooks/useIsMobile';
import { PaymentPage } from '@/app/pages/PaymentPage';
import { MobilePaymentPage } from '@/app/pages/mobile/MobilePaymentPage';

export function ResponsivePaymentPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobilePaymentPage /> : <PaymentPage />;
}
