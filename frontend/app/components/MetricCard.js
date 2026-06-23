'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ label, value, trend, suffix = '', prefix = '', icon: Icon, color = 'blue', delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const colorMap = {
    blue: { bg: 'from-accent-blue/20 to-accent-blue/5', border: 'border-accent-blue/20', text: 'text-accent-blue', glow: 'hover:shadow-accent-blue/10' },
    purple: { bg: 'from-accent-purple/20 to-accent-purple/5', border: 'border-accent-purple/20', text: 'text-accent-purple', glow: 'hover:shadow-accent-purple/10' },
    emerald: { bg: 'from-accent-emerald/20 to-accent-emerald/5', border: 'border-accent-emerald/20', text: 'text-accent-emerald', glow: 'hover:shadow-accent-emerald/10' },
    cyan: { bg: 'from-accent-cyan/20 to-accent-cyan/5', border: 'border-accent-cyan/20', text: 'text-accent-cyan', glow: 'hover:shadow-accent-cyan/10' },
    amber: { bg: 'from-accent-amber/20 to-accent-amber/5', border: 'border-accent-amber/20', text: 'text-accent-amber', glow: 'hover:shadow-accent-amber/10' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass-card glass-card-hover p-5 cursor-default transition-shadow duration-300 hover:shadow-lg ${c.glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} border ${c.border} flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            trend >= 0 ? 'text-accent-emerald bg-accent-emerald/10' : 'text-accent-rose bg-accent-rose/10'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-text-primary tracking-tight">
          {prefix}{typeof value === 'number' && value > 100 ? count.toLocaleString() : count}{suffix}
        </p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </motion.div>
  );
}
