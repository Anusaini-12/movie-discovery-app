import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-purple-500/10 text-purple-200 shadow-sm shadow-purple-950/20"
        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 overflow-hidden border-b border-white/[0.08] bg-[#05050a]/85 backdrop-blur-xl">
      {/* Night-sky glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 -top-32 h-56 w-56 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Navbar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-lg shadow-lg shadow-purple-950/20">
              🎬
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              Movie<span className="text-zinc-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 shadow-lg shadow-black/20 sm:flex">
            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/movies"
              className={navLinkClass}
            >
              Movies
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `${navLinkClass({
                  isActive,
                })} flex items-center gap-2`
              }
            >
              Wishlist

              {wishlist.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-300 px-1 text-[10px] font-bold text-purple-950">
                  {wishlist.length}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-300 shadow-lg shadow-black/20 transition duration-200 hover:bg-white/[0.06] hover:text-white sm:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="text-xl">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`grid transition-all duration-300 ease-out sm:hidden ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`border-t border-white/[0.08] py-3 transition-transform duration-300 ease-out ${
                menuOpen
                  ? "translate-y-0"
                  : "-translate-y-2"
              }`}
            >
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-1">
                <div className="flex flex-col gap-1">
                  {/* Home */}
                  <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={navLinkClass}
                  >
                    Home
                  </NavLink>

                  {/* Movies */}
                  <NavLink
                    to="/movies"
                    onClick={closeMenu}
                    className={navLinkClass}
                  >
                    Movies
                  </NavLink>

                  {/* Wishlist */}
                  <NavLink
                    to="/wishlist"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `${navLinkClass({
                        isActive,
                      })} flex items-center justify-between`
                    }
                  >
                    <span>Wishlist</span>

                    {wishlist.length > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-300 px-1.5 text-xs font-bold text-purple-950">
                        {wishlist.length}
                      </span>
                    )}
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;