import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

/** Inline / legacy: matches app chrome. */
const appearanceDefault = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#1a1a1a',
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorDanger: '#b91c1c',
    fontFamily: 'inherit',
    borderRadius: '4px',
  },
};

/** Closer to Stripe Dashboard / checkout.stripe.dev embedded look. */
const appearanceCheckout = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#635BFF',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    borderRadius: '8px',
    spacingUnit: '6px',
  },
};

function StripePaymentElementForm({
  clientSecret,
  returnUrl,
  preferredPaymentMethod,
  layout,
  onSuccess,
  onCancel,
  disabled,
}: {
  clientSecret: string;
  returnUrl: string;
  preferredPaymentMethod?: 'card' | 'upi' | 'wallet';
  layout: 'default' | 'checkout';
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const isCheckout = layout === 'checkout';
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExpressCheckout, setShowExpressCheckout] = useState(true);

  /** First entry is shown/selected first; Stripe skips types not enabled on the PaymentIntent. */
  const paymentElementOptions = useMemo(() => {
    const base = {
      layout: 'tabs' as const,
      defaultCollapsed: false,
    };
    switch (preferredPaymentMethod) {
      case 'upi':
        return { ...base, paymentMethodOrder: ['upi', 'card', 'link', 'cashapp'] };
      case 'wallet':
        return { ...base, paymentMethodOrder: ['link', 'cashapp', 'upi', 'card'] };
      case 'card':
      default:
        return { ...base, paymentMethodOrder: ['card', 'upi', 'link', 'cashapp'] };
    }
  }, [preferredPaymentMethod]);

  const expressCheckoutOptions = useMemo(
    () => ({
      layout: {
        maxColumns: 2,
        maxRows: 1,
      } as const,
      buttonHeight: 48,
    }),
    []
  );

  const handleExpressConfirm = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      const msg = submitError.message || 'Could not continue.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: undefined,
      },
      redirect: 'if_required',
    });

    setLoading(false);

    if (confirmError) {
      const msg = confirmError.message || 'Payment failed. Please try again.';
      setError(msg);
      toast.error(msg);
      return;
    }

    toast.success('Payment confirmed!');
    onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: undefined,
      },
      redirect: 'if_required',
    });

    setLoading(false);

    if (confirmError) {
      const msg = confirmError.message || 'Payment failed. Please try again.';
      setError(msg);
      toast.error(msg);
      return;
    }

    toast.success('Payment confirmed!');
    onSuccess();
  };

  const isStripeReady = !!stripe;

  const boxExpress = isCheckout
    ? 'rounded-xl bg-[#f6f9fc] p-3 min-h-[52px] border border-[#e3e8ee]'
    : 'border border-foreground/20 bg-background p-3 min-h-[52px]';
  const boxPayment = isCheckout ? 'rounded-xl bg-white p-1 border border-[#e3e8ee]' : 'border border-foreground/20 bg-background p-4';

  return (
    <form onSubmit={handleSubmit} className={isCheckout ? 'space-y-6' : 'space-y-4'}>
      {!isStripeReady && (
        <p className={isCheckout ? 'text-sm text-[#6a7383]' : 'text-xs text-foreground/50 uppercase tracking-wider'}>
          {isCheckout ? 'Loading secure payment…' : 'Loading secure payment form…'}
        </p>
      )}

      {showExpressCheckout && (
        <div className="space-y-3">
          <div className={boxExpress}>
            <ExpressCheckoutElement
              options={expressCheckoutOptions}
              onReady={({ availablePaymentMethods }) => {
                const apm = availablePaymentMethods as Record<string, boolean> | undefined;
                const has = apm ? Object.values(apm).some(Boolean) : false;
                setShowExpressCheckout(has);
              }}
              onConfirm={handleExpressConfirm}
            />
          </div>
          <p
            className={
              isCheckout
                ? 'text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#6a7383]'
                : 'text-center text-xs text-foreground/50 uppercase tracking-wider'
            }
          >
            Or pay with card or bank
          </p>
        </div>
      )}

      <div className={boxPayment}>
        <PaymentElement options={paymentElementOptions} />
      </div>

      {error && (
        <p
          className={
            isCheckout
              ? 'text-sm text-[#df1b41] bg-[#fff5f5] border border-[#f8ccd4] rounded-lg px-3 py-2'
              : 'text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2'
          }
          role="alert"
        >
          {error}
        </p>
      )}

      <div className={`flex items-start gap-2 text-xs ${isCheckout ? 'text-[#6a7383]' : 'text-foreground/50'}`}>
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <span>
          {isCheckout
            ? 'Payments are processed by Stripe. Link, Apple Pay, Google Pay, and cards may appear based on your device and region.'
            : 'Encrypted checkout. Express buttons (Link, Apple Pay, Google Pay where available), then card, UPI, or wallets.'}
        </span>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!isStripeReady || loading || disabled}
          className={
            isCheckout
              ? 'flex-1 h-12 rounded-lg bg-[#635BFF] text-white font-semibold text-sm hover:bg-[#5851EA] transition-colors disabled:opacity-40 shadow-sm'
              : 'flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs disabled:opacity-40'
          }
        >
          {loading ? 'Processing…' : !isStripeReady ? 'Loading…' : 'Pay'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={
            isCheckout
              ? 'h-12 px-6 rounded-lg border border-[#e3e8ee] text-[#30313d] font-medium text-sm hover:bg-[#f6f9fc] transition-colors disabled:opacity-40'
              : 'h-11 px-6 border border-foreground/20 text-foreground hover:bg-foreground/5 transition-all uppercase tracking-widest text-xs disabled:opacity-40'
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function StripePaymentForm({
  publishableKey,
  clientSecret,
  returnUrl,
  preferredPaymentMethod,
  layout = 'default',
  onSuccess,
  onCancel,
  disabled,
}: {
  publishableKey: string;
  clientSecret: string;
  returnUrl: string;
  preferredPaymentMethod?: 'card' | 'upi' | 'wallet';
  /** `checkout`: Stripe-like colors + spacing (use with fullscreen shell). */
  layout?: 'default' | 'checkout';
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: layout === 'checkout' ? appearanceCheckout : appearanceDefault,
    }),
    [clientSecret, layout]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentElementForm
        clientSecret={clientSecret}
        returnUrl={returnUrl}
        preferredPaymentMethod={preferredPaymentMethod}
        layout={layout}
        onSuccess={onSuccess}
        onCancel={onCancel}
        disabled={disabled}
      />
    </Elements>
  );
}
