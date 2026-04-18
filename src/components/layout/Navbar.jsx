import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Menu, X, Sparkles, Bell, ChevronDown } from 'lucide-react';
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

  const IconButton = ({ onClick, label, children, className = '' }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        relative p-2 rounded-xl
        text-gray-500 dark:text-gray-400
        hover:text-gray-700 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-white/5
        active:scale-95 transition-all duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* ★ Full-width navbar — no max-w container */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">

          {/* ★ Left: Logo — flush to left edge */}
          <Link
            to={dashboardRoute}
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-primary-500/20 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white hidden sm:block">
              ExamHub
            </span>
          </Link>

          {/* ★ Right: Actions — flush to right edge */}
          <div className="hidden lg:flex items-center gap-1">
            <IconButton onClick={toggleDark} label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>

            <IconButton label="Notifications">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
            </IconButton>

            {isAuthenticated && user && (
              <>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1.5" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 ring-1 ring-primary-200 dark:ring-primary-800/40">
                      <span className="text-white font-bold text-[11px] leading-none">
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

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1 animate-fade-up z-50">
                      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-primary-100 dark:ring-primary-900/30">
                            <span className="text-white font-bold text-sm leading-none">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                              {(user.role || '').toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          user.role === 'ADMIN'
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.role === 'ADMIN' ? 'bg-primary-500' : 'bg-success-500'
                          }`} />
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

          {/* Mobile Right */}
          <div className="lg:hidden flex items-center gap-0.5">
            <IconButton onClick={toggleDark} label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>

            <IconButton label="Notifications">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
            </IconButton>

            <IconButton onClick={() => setMobileOpen(!mobileOpen)} label="Toggle menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-xl lg:hidden animate-fade-up">
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated && user && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 ring-2 ring-primary-100 dark:ring-primary-900/30 shadow-sm">
                      <span className="text-white font-bold text-sm leading-none">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.role === 'ADMIN' ? 'bg-primary-500' : 'bg-success-500'
                        }`} />
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                          {(user.role || '').toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/15 hover:bg-danger-100 dark:hover:bg-danger-900/25 border border-danger-200 dark:border-danger-800/50 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;