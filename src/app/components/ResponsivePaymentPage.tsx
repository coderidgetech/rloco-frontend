import { PaymentPage } from '@/app/pages/PaymentPage';

/** Single payment flow for desktop and mobile; creates order via API and Stripe (card) / COD where supported. */
export function ResponsivePaymentPage() {
  return <PaymentPage />;
}
