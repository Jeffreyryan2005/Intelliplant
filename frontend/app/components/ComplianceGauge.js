'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ComplianceGauge({ score, size = 200, label = 'Overall Compliance' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const getColor = (s) => {
    if (s >= 85) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)', text: 'text-accent-emerald', label: 'Good' };
    if (s >= 70) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', text: 'text-accent-amber', label: 'Fair' };
    return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.3)', text: 'text-accent-rose', label: 'Poor' };
  };

  const c = getColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={c.stroke}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.5s ease-out',
              filter: `drop-shadow(0 0 8px ${c.glow})`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${c.text}`}>{animatedScore}</span>
          <span className="text-sm text-text-muted">/ 100</span>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className={`text-xs font-medium ${c.text}`}>{c.label}</p>
      </div>
    </motion.div>
  );
}
