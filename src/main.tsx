import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Service Worker: only in production (dev server: unregister so no FetchEvent errors)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered', reg))
      .catch((err) => console.warn('SW registration failed', err));
  });
}
if ('serviceWorker' in navigator && !import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure there is a <div id='root'></div> in your index.html"
  );
}

createRoot(rootElement).render(<App />);