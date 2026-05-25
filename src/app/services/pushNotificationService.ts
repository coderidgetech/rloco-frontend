import { isFirebaseConfigured } from '../lib/firebase';
import api from '../lib/api';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export const pushNotificationService = {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'Notification' in window &&
      isFirebaseConfigured &&
      !!VAPID_KEY
    );
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    return Notification.requestPermission();
  },

  async registerToken(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return;

      const swReg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      swReg.active?.postMessage({
        type: 'FIREBASE_CONFIG',
        config: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        },
      });

      const { getMessaging, getToken } = await import(/* @vite-ignore */ 'firebase/messaging');
      const { firebaseApp } = await import('../lib/firebase');
      const messaging = getMessaging(firebaseApp);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg,
      });

      if (token) {
        await api.post('/notifications/device-token', { token, platform: 'web' });
      }
    } catch {
      // Permission denied, Firebase not configured, or browser not supported — fail silently
    }
  },

  async unregister(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      const { getMessaging, getToken, deleteToken } = await import(/* @vite-ignore */ 'firebase/messaging');
      const { firebaseApp } = await import('../lib/firebase');
      const messaging = getMessaging(firebaseApp);
      const swReg = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg,
      }).catch(() => null);
      if (token) {
        await api.delete('/notifications/device-token', { data: { token } });
        await deleteToken(messaging);
      }
    } catch {
      // fail silently
    }
  },
};
