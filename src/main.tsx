

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './firebaseUtils';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Register the service worker so Chrome offers "Install app" and push notifications work
// (navigator.serviceWorker.ready never resolves without a registered worker).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(err => {
      console.warn('[sw] registration failed:', err);
    });
  });
}
