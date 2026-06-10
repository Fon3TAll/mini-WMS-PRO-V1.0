import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress known benign errors from html5-qrcode library disconnecting from the video stream
const originalPlay = HTMLVideoElement.prototype.play;
if (originalPlay) {
  HTMLVideoElement.prototype.play = function (...args) {
    const promise = originalPlay.apply(this, args);
    if (promise instanceof Promise) {
      promise.catch((error) => {
        const isInterruptedError = error && (
          error.name === 'AbortError' || 
          (typeof error.message === 'string' && error.message.includes('The play() request was interrupted'))
        );
        if (!isInterruptedError) {
          // Rethrow genuine errors
          throw error;
        }
      });
    }
    return promise;
  };
}

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason.message === 'string' && (event.reason.message.includes('The play() request was interrupted') || event.reason.name === 'AbortError')) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (event.message && typeof event.message === 'string' && (event.message.includes('The play() request was interrupted') || event.message.includes('AbortError'))) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
