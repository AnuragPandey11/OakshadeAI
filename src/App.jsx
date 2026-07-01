// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Header from "./components/ui/header.jsx";
import Footer from "./components/ui/footer.jsx";
import Home from "./pages/Home.jsx";
import AllServices from "./pages/AllServices.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import AllWork from "./pages/AllWork.jsx";

/* Reset scroll to the top on route change — except when a section-scroll was
   requested (Home reads `state.scrollTo` and handles that itself). */
function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (!state?.scrollTo) window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
}

/* Shared chrome: header + page content + footer. */
function Layout() {
  return (
    <main className="w-full overflow-hidden bg-white font-sans text-neutral-800 antialiased">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<AllServices />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/work" element={<AllWork />} />
        </Route>
      </Routes>
    </>
  );
}
