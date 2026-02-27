import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import Nav from "../../features/post/components/Nav";
import { usePageReveal } from "../../hooks/usePageReveal";

function MainLayout() {
  const location = useLocation();
  const shellRef = useRef(null);

  usePageReveal(shellRef, [location.pathname]);

  return (
    <div ref={shellRef} className="page-shell">
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 lg:pl-72 lg:pr-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
