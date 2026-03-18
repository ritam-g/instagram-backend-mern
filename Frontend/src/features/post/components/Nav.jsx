import { useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import {
  FiHome,
  FiLogIn,
  FiMoon,
  FiPlusSquare,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../auth/hooks/useAuth";

function Nav() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const avatarRef = useRef(null);

  const profilePath = "/profile/me";

  const navItems = useMemo(() => {
    const items = [
      {
        label: "Feed",
        path: "/feed-page",
        icon: <FiHome />,
        active: location.pathname === "/feed-page",
      },
      {
        label: "Create",
        path: "/createpost",
        icon: <FiPlusSquare />,
        active: location.pathname === "/createpost",
      },
      {
        label: "Profile",
        path: profilePath,
        icon: <FiUser />,
        active: location.pathname.startsWith("/profile/"),
      }
    ];
    if (!user) {
      items.push({
        label: "Login",
        path: "/",
        icon: <FiLogIn />,
        active: location.pathname === "/",
      });
    }
    return items;
  }, [location.pathname, user, profilePath]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (desktopNavRef.current) {
        gsap.fromTo(
          desktopNavRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.38, ease: "power2.out" }
        );
      }

      if (mobileNavRef.current) {
        gsap.fromTo(
          mobileNavRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleAvatarHover = () => {
    if (!avatarRef.current) {
      return;
    }

    gsap.fromTo(
      avatarRef.current,
      { scale: 1 },
      { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  };

  return (
    <>
      <aside
        ref={desktopNavRef}
        className="glass-surface sticky top-0 h-screen z-40 hidden w-64 rounded-3xl p-5 lg:flex lg:flex-col justify-between shrink-0"
      >
        {/* TOP */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            InstaLite
          </h1>
          <p className="mt-1 text-xs text-muted dark:text-slate-400">
            Social dashboard
          </p>
        </div>

        {/* CENTER */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.path}`}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${item.active
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-secondary)] hover:bg-white/50 hover:text-[var(--text-primary)] dark:hover:bg-slate-700/40"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* BOTTOM */}
        <div className="flex items-center justify-between">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-[var(--text-primary)] transition hover:scale-105 hover:bg-white dark:bg-slate-800/70"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <Link
            to={profilePath}
            ref={avatarRef}
            onMouseEnter={handleAvatarHover}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/70 bg-white/60 transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800/70"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <FiUser />
            )}
          </Link>
        </div>
      </aside>

      <nav
        ref={mobileNavRef}
        className="glass-surface fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-1.5rem)] -translate-x-1/2 items-center justify-between rounded-2xl px-3 py-2 lg:hidden"
      >
        {navItems.slice(0, 3).map((item) => (
          <Link
            key={`mobile-${item.label}-${item.path}`}
            to={item.path}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition ${item.active
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-secondary)] hover:bg-white/50 dark:hover:bg-slate-700/40"
              }`}
            aria-label={item.label}
          >
            {item.icon}
          </Link>
        ))}

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-[var(--text-primary)] transition hover:bg-white dark:bg-slate-800/70"
          onClick={toggleTheme}
          type="button"
          aria-label="toggle theme"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      </nav>
    </>
  );
}

export default Nav;
