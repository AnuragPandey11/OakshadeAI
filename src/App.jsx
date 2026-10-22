// src/App.jsx
import { useRef } from "react";
import { Routes, Route, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/ui/header.jsx";
import Footer from "./components/ui/footer.jsx";
import Home from "./pages/Home.jsx";
import AllServices from "./pages/AllServices.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import AllWork from "./pages/AllWork.jsx";
import Intro from "./components/ui/intro.jsx";
import ViewCursor from "./components/ui/view-cursor.jsx";
import { resetScroll } from "./lib/smooth-scroll";

/* Shared chrome: header + page content + footer.

   Pages cross-fade on route change: the old page fades out, the window
   scrolls to the top while nothing is visible, then the new page rises in.
   The scroll reset happens in onExitComplete (not on the route change) so the
   outgoing page doesn't jump while it's fading. It's skipped when a
   section-scroll was requested — Home reads `state.scrollTo` and handles it.

   overflow-x-clip (not overflow-hidden) trims the hero's scaled video without
   making <main> a scroll container, which would break every `sticky` inside. */
function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const locationRef = useRef(location);
  locationRef.current = location;

  return (
    <main className="w-full overflow-x-clip bg-white font-sans text-neutral-800 antialiased">
      <Intro />
      <ViewCursor />
      <Header />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (!locationRef.current.state?.scrollTo) resetScroll();
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/work" element={<AllWork />} />
      </Route>
    </Routes>
  );
}
