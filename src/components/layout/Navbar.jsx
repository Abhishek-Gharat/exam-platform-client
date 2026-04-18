import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Menu, X, Sparkles, Bell, ChevronDown, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

const Navbar = () => {
  const nav = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dashboardRoute =
    user?.role === 'ADMIN'
      ? ROUTES.ADMIN_DASHBOARD
      : user?.role === 'TEACHER'
        ? ROUTES.TEACHER_DASHBOARD || ROUTES.ADMIN_DASHBOARD
        : ROUTES.DASHBOARD;

  useEffect(() => {
    const s = localStorage.getItem('theme');
    if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success('Logged out');
    nav(ROUTES.LOGIN);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 lg:px-6">

          {/* Left: Logo */}
          <Link
            to={dashboardRoute}
            className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 dark:text-white truncate">
              ExamHub
            </span>
          </Link>

          {/* Right: Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
            </button>

            {isAuthenticated && user && (
              <>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1.5" />

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-1 ring-primary-200 dark:ring-primary-800/40">
                      <span className="text-white font-bold text-[11px]">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize leading-none mt-0.5">
                        {(user.role || '').toLowerCase()}
                      </p>
                    </div>
                    <ChevronDown
                      size={13}
                      className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1 animate-fade-up z-50">
                      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-primary-100 dark:ring-primary-900/30">
                            <span className="text-white font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">{(user.role || '').toLowerCase()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          user.role === 'ADMIN'
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-primary-500' : 'bg-success-500'}`} />
                          {(user.role || 'user').toLowerCase()}
                        </span>
                      </div>
                      <div className="px-1.5 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Mobile — only hamburger + avatar */}
          <div className="lg:hidden flex items-center gap-1.5">
            {/* Only show notification dot indicator */}
            <button
              aria-label="Notifications"
              className="relative p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all"
            >
              <Bell size={16} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white dark:ring-gray-950" />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-down panel */}
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-2xl animate-fade-up safe-bottom">

            {/* Mobile nav header — matches main navbar */}
            <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 border-b border-gray-100 dark:border-gray-800">
              <Link
                to={dashboardRoute}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                  ExamHub
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">

              {isAuthenticated && user && (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 ring-2 ring-primary-100 dark:ring-primary-900/30 shadow-md shadow-primary-500/20">
                      <span className="text-white font-bold text-lg leading-none">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                        {user.name}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 ${
                        user.role === 'ADMIN'
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.role === 'ADMIN' ? 'bg-primary-500' : 'bg-success-500'
                        }`} />
                        {(user.role || 'user').toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="space-y-1">
                    {/* Theme Toggle */}
                    <button
                      onClick={() => { toggleDark(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        {dark ? <Sun size={15} className="text-warning-500" /> : <Moon size={15} className="text-gray-500" />}
                      </div>
                      <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                      <div className={`ml-auto w-9 h-5 rounded-full transition-colors ${dark ? 'bg-primary-500' : 'bg-gray-300'} p-0.5`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${dark ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>

                    {/* Notifications */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 relative">
                        <Bell size={15} className="text-gray-500 dark:text-gray-400" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-gray-800" />
                      </div>
                      <span>Notifications</span>
                      <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md">3</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-gray-800" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/10 transition-colors active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center flex-shrink-0">
                      <LogOut size={15} className="text-danger-500" />
                    </div>
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;