import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { initSmoothScroll } from './lib/smooth-scroll';
import './index.css';

/* Browsers restore the previous scroll position on reload, which reopens the
   site mid-page. Take ownership of it here (before React mounts) — the page
   transition in App.jsx then puts every route change at the top. */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/* Smooth wheel scrolling (Lenis). Started before React mounts so it already
   exists when components lock scrolling during their first effects (the
   intro does). Lives for the whole session — never torn down. */
initSmoothScroll();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* reducedMotion="user": with the OS setting on, Framer drops transform
        animations site-wide (fades remain). */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>
);
