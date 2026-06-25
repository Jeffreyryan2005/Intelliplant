'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, PenTool, AlertTriangle, PlayCircle, History, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TIMELINE_DATA = [
  {
    year: '2022',
    month: 'Aug',
    type: 'install',
    title: 'Initial Installation',
    desc: 'Pump P-101A installed during plant commissioning.',
    icon: PlayCircle,
    color: 'emerald',
  },
  {
    year: '2023',
    month: 'Dec',
    type: 'inspection',
    title: 'Annual Inspection',
    desc: 'Vibration baselines recorded. All parameters within normal limits.',
    icon: Activity,
    color: 'blue',
  },
  {
    year: '2024',
    month: 'Sep',
    type: 'maintenance',
    title: 'Preventive Maintenance',
    desc: 'Routine oil change and mechanical seal inspection performed.',
    icon: PenTool,
    color: 'purple',
  },
  {
    year: '2025',
    month: 'Nov',
    type: 'failure',
    title: 'Seal Failure Incident',
    desc: 'Unexpected seal leak led to 24-hour shutdown.',
    icon: AlertTriangle,
    color: 'rose',
  },
  {
    year: '2026',
    month: 'Jan',
    type: 'ai',
    title: 'AI Root Cause Analysis',
    desc: 'Maintenance Agent identified thermal cycling as the root cause of seal wear. Startup SOP modified.',
    icon: History,
    color: 'amber',
  },
  {
    year: '2026',
    month: 'Current',
    type: 'status',
    title: 'Current Status',
    desc: 'Operating nominally with new thermal sleeve installed. Next PM in 4 months.',
    icon: Activity,
    color: 'emerald',
  },
];

export default function TimelinePage() {
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all' ? TIMELINE_DATA : TIMELINE_DATA.filter(t => t.type === filter);

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent-blue" />
              Industrial Memory Timeline
            </h1>
            <p className="text-text-muted">Equipment lifecycle tracked by the AI Knowledge Graph.</p>
          </div>
          
          <div className="glass-card px-2 py-1 flex items-center gap-1">
            <Filter className="w-4 h-4 text-text-muted ml-2 mr-1" />
            {['all', 'install', 'maintenance', 'failure', 'ai'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-[59px] md:left-[119px] top-12 bottom-12 w-1 bg-gradient-to-b from-accent-emerald via-accent-amber to-accent-blue opacity-20 rounded-full" />
          
          <div className="space-y-12">
            {filteredData.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex items-start group"
                >
                  {/* Date Column */}
                  <div className="w-[80px] md:w-[140px] flex-shrink-0 pt-1 flex flex-col items-end pr-8">
                    <span className="text-sm font-bold text-text-primary">{item.year}</span>
                    <span className="text-xs text-text-muted uppercase tracking-wider">{item.month}</span>
                  </div>

                  {/* Icon */}
                  <div className={`absolute left-[47px] md:left-[107px] w-7 h-7 rounded-full border-4 border-bg-primary bg-accent-${item.color} flex items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--accent-${item.color}-rgb),0.5)] group-hover:scale-110 transition-transform`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 ml-4 md:ml-8 pl-4 border-l border-white/5 pb-2">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 hover:bg-white/[0.04] transition-colors shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-${item.color}/10 text-accent-${item.color} border border-accent-${item.color}/20`}>
                          {item.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
