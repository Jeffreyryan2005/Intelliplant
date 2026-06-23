'use client';

import { motion } from 'framer-motion';
import { FileText, Image, Table2, Eye, Trash2, Clock, Tag, Layers } from 'lucide-react';

const typeIcons = {
  pdf: { icon: FileText, color: 'text-accent-rose', bg: 'bg-accent-rose/10' },
  image: { icon: Image, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  spreadsheet: { icon: Table2, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
  document: { icon: FileText, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
};

const statusColors = {
  processed: { text: 'text-accent-emerald', bg: 'bg-accent-emerald/10', label: 'Processed' },
  processing: { text: 'text-accent-amber', bg: 'bg-accent-amber/10', label: 'Processing' },
  failed: { text: 'text-accent-rose', bg: 'bg-accent-rose/10', label: 'Failed' },
};

export default function DocumentCard({ document, index = 0, onView, onDelete }) {
  const t = typeIcons[document.type] || typeIcons.document;
  const s = statusColors[document.status] || statusColors.processed;
  const IconComp = t.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="glass-card glass-card-hover p-5 cursor-pointer group transition-all duration-300"
      onClick={() => onView?.(document)}
    >
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center flex-shrink-0`}>
          <IconComp className={`w-6 h-6 ${t.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-blue transition-colors">
              {document.title}
            </h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text} flex-shrink-0`}>
              {s.label}
            </span>
          </div>

          <p className="text-xs text-text-muted line-clamp-2 mb-3">
            {document.description}
          </p>

          {/* Tags */}
          {document.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {document.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-text-secondary border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {document.uploadDate}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {document.pages} pages
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {document.entityCount} entities
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onView?.(document); }}
                className="w-7 h-7 rounded-lg hover:bg-accent-blue/10 flex items-center justify-center text-text-muted hover:text-accent-blue transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(document); }}
                className="w-7 h-7 rounded-lg hover:bg-accent-rose/10 flex items-center justify-center text-text-muted hover:text-accent-rose transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
