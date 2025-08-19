"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(!!localStorage.getItem("token"));
    }
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setShowSidebar(false);
    setShowModal(false);
    setAuthed(false);
    router.push("/login");
  }

  const menuItems = [
    { href: "/saved", label: "Saved Movies" },
    { href: "/search", label: "Search Movies" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xs bg-slate-950/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="font-bold text-lg tracking-wide">
            🎬 MiniMovie
          </Link>

          {authed && (
            <>
              {/* Desktop Menu */}
              <nav className="hidden md:flex gap-6 items-center">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hover:text-blue-400 transition ${
                      pathname.startsWith(item.href)
                        ? "text-blue-400 font-semibold"
                        : "text-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Logout button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="text-white/80 hover:text-red-400 transition"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                  </svg>
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden text-white/80 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Offcanvas Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-[9998] flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60"
            onClick={() => setShowSidebar(false)}
          />
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 h-full p-6 flex flex-col gap-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowSidebar(false)}
                className={`block px-2 py-2 rounded hover:bg-white/10 ${
                  pathname.startsWith(item.href)
                    ? "text-blue-400 font-semibold"
                    : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setShowSidebar(false);
                setShowModal(true);
              }}
              className="text-red-400 mt-auto flex items-center gap-2 hover:text-red-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="card p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-primary px-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
