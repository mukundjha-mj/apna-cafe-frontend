import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import * as Sentry from "@sentry/react";
import { store } from './store/store'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
registerSW({ immediate: true })

Sentry.init({
  dsn: "https://d2668aafba5e4bdb469711cd154fd43c@o4511298898952192.ingest.us.sentry.io/4511298901770240",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true, // As per your requirement
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Sentry.ErrorBoundary fallback={<div style={{ padding: '2rem', textAlign: 'center', background: '#120A06', color: '#BA7517', height: '100vh' }}><h2>Oops! Something went wrong.</h2><p>Our team has been notified.</p><button onClick={() => window.location.reload()} style={{ background: '#BA7517', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', marginTop: '1rem', color: 'white' }}>Reload Page</button></div>}>
        <App />
      </Sentry.ErrorBoundary>
    </Provider>
  </StrictMode>,
)
