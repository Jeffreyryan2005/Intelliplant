'use client';

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  healthy: { color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', border: 'border-accent-emerald/20', icon: CheckCircle2, label: 'Healthy' },
  warning: { color: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', icon: AlertTriangle, label: 'Warning' },
  critical: { color: 'text-accent-rose', bg: 'bg-accent-rose/10', border: 'border-accent-rose/20', icon: XCircle, label: 'Critical' },
};

export default function EquipmentCard({ equipment, index = 0, onClick }) {
  const sc = statusConfig[equipment.status] || statusConfig.healthy;
  const StatusIcon = sc.icon;

  const getHealthColor = (score) => {
    if (score >= 85) return 'text-accent-emerald';
    if (score >= 70) return 'text-accent-amber';
    return 'text-accent-rose';
  };

  const getHealthGradient = (score) => {
    if (score >= 85) return 'from-accent-emerald to-accent-cyan';
    if (score >= 70) return 'from-accent-amber to-accent-rose';
    return 'from-accent-rose to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -3 }}
      onClick={() => onClick?.(equipment)}
      className="glass-card glass-card-hover p-5 cursor-pointer group transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
              {equipment.tag}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.color} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {sc.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
            {equipment.name}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">{equipment.type} · {equipment.unit}</p>
        </div>
      </div>

      {/* Health Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-secondary">Health Score</span>
          <span className={`text-lg font-bold ${getHealthColor(equipment.healthScore)}`}>
            {equipment.healthScore}%
          </span>
        </div>
        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${equipment.healthScore}%` }}
            transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${getHealthGradient(equipment.healthScore)}`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-0.5">MTBF</p>
          <p className="text-sm font-semibold text-text-primary">{equipment.mtbf}d</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-0.5">Next PM</p>
          <p className="text-sm font-semibold text-text-primary">
            {equipment.nextMaintenance ? new Date(equipment.nextMaintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
