import { Link, useLocation } from 'react-router-dom';
import { Play, Music, Image, Edit3, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/player', label: 'Player', icon: Play },
  { path: '/audio', label: 'Audio', icon: Music },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/editor', label: 'Editor', icon: Edit3 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080c14]/90 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:shadow-cyan-500/60 transition-all">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-lg tracking-tight">PlayIt</span>
            <span className="text-cyan-400 font-bold text-lg ml-1">UHD+</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-inner shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-full px-3 py-1">
            <span className="text-xs text-cyan-400 font-semibold">Ultra HD+</span>
            <span className="text-[10px] text-slate-400 ml-1">8K Ready</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#080c14] border-t border-cyan-500/20 px-4 py-3 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
