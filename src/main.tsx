// Safe fetch property trap to prevent "Cannot set property fetch of #<Window> which has only a getter" error
try {
  if (typeof window !== 'undefined') {
    let _fetch = window.fetch ? window.fetch.bind(window) : undefined;
    const patchFetch = (obj: any) => {
      if (!obj) return;
      try {
        Object.defineProperty(obj, 'fetch', {
          configurable: true,
          enumerable: true,
          get() {
            return _fetch;
          },
          set(val) {
            _fetch = val;
          },
        });
      } catch {
        // Ignore
      }
    };
    patchFetch(window);
    if (typeof Window !== 'undefined' && Window.prototype) {
      patchFetch(Window.prototype);
    }
  }
} catch {
  // Ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

