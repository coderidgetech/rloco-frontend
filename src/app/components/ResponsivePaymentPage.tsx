import { PaymentPage } from '@/app/pages/PaymentPage';

/** Single payment flow for desktop and mobile; creates order via API and uses payment service (mock until gateway integrated). */
export function ResponsivePaymentPage() {
  return <PaymentPage />;
}
