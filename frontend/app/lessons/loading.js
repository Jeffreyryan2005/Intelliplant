"use client";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-white/5 rounded-lg"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-4 h-20 border border-white/5"></div>
        ))}
      </div>
      
      <div className="glass-card p-4 h-16 border border-white/5"></div>
      
      <div className="h-12 w-full bg-white/5 rounded-lg"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card h-64 border border-white/5"></div>
        ))}
      </div>
    </div>
  );
}
