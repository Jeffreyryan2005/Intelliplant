'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const typeColors = {
  upload: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  alert: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
  compliance: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
  maintenance: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  query: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  entity: 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
};

export default function TimelineItem({ item, index = 0 }) {
  const colors = typeColors[item.type] || typeColors.upload;
  const IconComp = Icons[item.icon] || Icons.Activity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex gap-3 group"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-lg ${colors} border flex items-center justify-center flex-shrink-0`}>
          <IconComp className="w-4 h-4" />
        </div>
        {index < 5 && <div className="w-px flex-1 bg-white/[0.06] mt-2" />}
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium group-hover:text-accent-blue transition-colors truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-text-muted">{item.user}</span>
          <span className="text-[11px] text-text-muted">·</span>
          <span className="text-[11px] text-text-muted">{item.time}</span>
        </div>
      </div>
    </motion.div>
  );
}
