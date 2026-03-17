import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const appearance = {
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

function StripePaymentElementForm({
  clientSecret,
  returnUrl,
  preferredPaymentMethod,
  onSuccess,
  onCancel,
  disabled,
}: {
  clientSecret: string;
  returnUrl: string;
  preferredPaymentMethod?: 'card' | 'upi' | 'wallet';
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isStripeReady && (
        <p className="text-xs text-foreground/50 uppercase tracking-wider">Loading secure payment form…</p>
      )}

      <div className="border border-foreground/20 bg-background p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultCollapsed: false,
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-foreground/50">
        <ShieldCheck size={14} />
        <span>Your payment is encrypted and secure. Card, UPI, and wallets are supported.</span>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!isStripeReady || loading || disabled}
          className="flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs disabled:opacity-40"
        >
          {loading ? 'Processing…' : !isStripeReady ? 'Loading…' : 'Pay Now'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 px-6 border border-foreground/20 text-foreground hover:bg-foreground/5 transition-all uppercase tracking-widest text-xs disabled:opacity-40"
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
  onSuccess,
  onCancel,
  disabled,
}: {
  publishableKey: string;
  clientSecret: string;
  returnUrl: string;
  preferredPaymentMethod?: 'card' | 'upi' | 'wallet';
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance,
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentElementForm
        clientSecret={clientSecret}
        returnUrl={returnUrl}
        preferredPaymentMethod={preferredPaymentMethod}
        onSuccess={onSuccess}
        onCancel={onCancel}
        disabled={disabled}
      />
    </Elements>
  );
}
