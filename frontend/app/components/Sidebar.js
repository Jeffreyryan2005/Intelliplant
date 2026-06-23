'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, MessageSquare, Share2,
  Wrench, ShieldCheck, ChevronLeft, ChevronRight,
  Brain, Zap, Menu, X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/copilot', label: 'Copilot', icon: MessageSquare },
  { href: '/graph', label: 'Knowledge Graph', icon: Share2 },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/[0.06]">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-emerald rounded-full border-2 border-bg-primary animate-pulse" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                Intelli<span className="text-gradient">Plant</span>
              </h1>
              <p className="text-[10px] text-text-muted font-medium tracking-wider uppercase">
                AI Knowledge Engine
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-accent-blue/10 border border-accent-blue/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-accent-blue' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue relative z-10"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/[0.06]">
        {!collapsed && (
          <div className="glass-card p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent-amber" />
              <span className="text-xs font-semibold text-text-primary">System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-[11px] text-text-secondary">All systems operational</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            VR
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-text-primary truncate">Vizag Refinery</p>
              <p className="text-[11px] text-text-muted truncate">Admin Console</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-bg-primary border-r border-white/[0.06] z-50 flex flex-col"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col h-screen bg-bg-primary border-r border-white/[0.06] flex-shrink-0 relative"
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>
    </>
  );
}
