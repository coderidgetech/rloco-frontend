import React, { useEffect, useRef, useCallback, ReactNode, useState } from 'react';
import api from '../lib/api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: string;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

/** Google Identity Services: `initialize()` must run once per client_id; callback reads latest handlers. */
const gsiHandlers: {
  clientId: string | null;
  onSuccess: ((credential: string) => void) | null;
  onError: ((message: string) => void) | null;
} = { clientId: null, onSuccess: null, onError: null };

function ensureGsiInitialized(clientId: string) {
  if (!window.google) return;
  if (gsiHandlers.clientId === clientId) return;
  gsiHandlers.clientId = clientId;
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        gsiHandlers.onSuccess?.(response.credential);
      } else {
        gsiHandlers.onError?.('Google sign-in failed. Please try again.');
      }
    },
    cancel_on_tap_outside: true,
  });
}

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: (message: string) => void;
  label?: string;
  shape?: 'rectangular' | 'pill';
  theme?: 'outline' | 'filled_black' | 'filled_blue';
  size?: 'large' | 'medium' | 'small';
  className?: string;
  customContent?: ReactNode;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  label,
  shape = 'rectangular',
  theme = 'outline',
  size = 'large',
  className = '',
  customContent,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envClientId = ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || '';
  const [apiClientId, setApiClientId] = useState('');
  const [fetchedFromApi, setFetchedFromApi] = useState(!!envClientId);
  const clientId =
    envClientId || (fetchedFromApi ? (apiClientId.trim() || undefined) : undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (envClientId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<{ google_client_id?: string }>('/auth/client-config');
        if (!cancelled) setApiClientId((data?.google_client_id || '').trim());
      } catch {
        if (!cancelled) setApiClientId('');
      } finally {
        if (!cancelled) setFetchedFromApi(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [envClientId]);

  const initButton = useCallback(() => {
    if (!window.google || !containerRef.current || !clientId) return;

    gsiHandlers.onSuccess = onSuccess;
    gsiHandlers.onError = onError ?? null;
    ensureGsiInitialized(clientId);

    if (!customContent) {
      window.google.accounts.id.renderButton(containerRef.current, {
        theme,
        size,
        width: containerRef.current.offsetWidth || 400,
        text: label === 'signup' ? 'signup_with' : 'continue_with',
        shape,
      });
    }

    setIsReady(true);
  }, [clientId, onSuccess, onError, label, theme, size, shape, customContent]);

  useEffect(() => {
    if (!clientId) return;

    if (window.google) {
      initButton();
      return;
    }

    // Load GSI script if not already loaded
    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      existing.addEventListener('load', initButton);
      return () => existing.removeEventListener('load', initButton);
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initButton;
    document.head.appendChild(script);
  }, [clientId, initButton]);

  if (!clientId) {
    if (!fetchedFromApi) {
      return (
        <button
          type="button"
          disabled
          className={`w-full flex items-center justify-center gap-3 py-3 border border-foreground/20 text-foreground/50 text-sm cursor-wait ${className}`}
        >
          <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-foreground/20" />
          Sign-in options…
        </button>
      );
    }
    return (
      <button
        type="button"
        disabled
        title="Set GOOGLE_CLIENT_ID on the API, or VITE_GOOGLE_CLIENT_ID in the web build, or add GitHub secret VITE_GOOGLE_CLIENT_ID for the Publish Droplet images workflow."
        className={`w-full flex items-center justify-center gap-3 py-3 border border-foreground/20 text-foreground/40 text-sm cursor-not-allowed ${className}`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
        </svg>
        Continue with Google (not configured)
      </button>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {customContent ? (
        <div ref={containerRef} className="w-full">
          <button
            type="button"
            onClick={() => {
              if (!window.google || !isReady) {
                onError?.('Google sign-in is still loading. Please try again.');
                return;
              }
              window.google.accounts.id.prompt();
            }}
            className="w-full text-left"
          >
            <div aria-hidden="true">{customContent}</div>
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full overflow-hidden"
          style={{ minHeight: '44px' }}
        />
      )}
    </div>
  );
}
