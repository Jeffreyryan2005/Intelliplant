'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Command, Sun, Moon } from 'lucide-react';

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('light-theme');
      setIsLightMode(!isLightMode);
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-xl sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl ml-12 lg:ml-0">
        <motion.div
          animate={{
            borderColor: searchFocused ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
            boxShadow: searchFocused ? '0 0 20px rgba(59, 130, 246, 0.1)' : '0 0 0 transparent',
          }}
          className="relative flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 transition-colors"
        >
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search documents, equipment, procedures..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="hidden sm:flex items-center gap-1 text-text-muted flex-shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/[0.06] rounded border border-white/[0.08] font-mono">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/[0.06] rounded border border-white/[0.08] font-mono">K</kbd>
          </div>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative w-9 h-9 rounded-xl hover:bg-white/[0.05] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="Toggle Theme"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl hover:bg-white/[0.05] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full" />
        </button>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/[0.06]">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">Vizag Refinery</p>
            <p className="text-[11px] text-text-muted">Operations Hub</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-emerald to-accent-cyan flex items-center justify-center text-white text-xs font-bold">
            VR
          </div>
        </div>
      </div>
    </div>
  );
}
