"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-white/5 rounded-lg"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 h-24 border border-white/5"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 h-96 border border-white/5"></div>
          <div className="glass-card p-6 h-48 border border-white/5"></div>
        </div>
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-[600px] border border-white/5"></div>
        </div>
      </div>
    </div>
  );
}
