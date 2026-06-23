'use client';

import { motion } from 'framer-motion';
import MetricCard from './components/MetricCard';
import TimelineItem from './components/TimelineItem';
import PageTransition from './components/PageTransition';
import { dashboardMetrics, recentActivity, systemHealth, PLANT_INFO } from './lib/demoData';
import {
  FileText, Brain, Cpu, ShieldCheck,
  Upload, MessageSquare, Share2,
  ArrowRight, Sparkles, Activity,
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  { label: 'Upload Document', icon: Upload, href: '/documents', color: 'from-accent-blue to-accent-purple' },
  { label: 'Ask Copilot', icon: MessageSquare, href: '/copilot', color: 'from-accent-emerald to-accent-cyan' },
  { label: 'View Graph', icon: Share2, href: '/graph', color: 'from-accent-purple to-accent-rose' },
];

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-8 lg:p-10 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl"
        >
          {/* Subtle Glows */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-blue/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-xs font-semibold text-accent-amber uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligence Active
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-emerald">IntelliPlant</span>
            </h1>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl font-medium">
              {PLANT_INFO.name} <span className="opacity-40 px-2">•</span> {PLANT_INFO.location} <span className="opacity-40 px-2">•</span> {PLANT_INFO.capacity} Capacity
            </p>
            <p className="text-text-muted text-sm mt-2 max-w-xl leading-relaxed">
              Your unified neural operations brain. Seamlessly connecting process data, maintenance logs, and regulatory compliance into a real-time knowledge engine.
            </p>
          </div>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label={dashboardMetrics.documentsIngested.label}
            value={dashboardMetrics.documentsIngested.value}
            trend={dashboardMetrics.documentsIngested.trend}
            icon={FileText}
            color="blue"
            delay={0}
          />
          <MetricCard
            label={dashboardMetrics.knowledgeEntities.label}
            value={dashboardMetrics.knowledgeEntities.value}
            trend={dashboardMetrics.knowledgeEntities.trend}
            icon={Brain}
            color="purple"
            delay={0.1}
          />
          <MetricCard
            label={dashboardMetrics.activeEquipment.label}
            value={dashboardMetrics.activeEquipment.value}
            trend={dashboardMetrics.activeEquipment.trend}
            icon={Cpu}
            color="cyan"
            delay={0.2}
          />
          <MetricCard
            label={dashboardMetrics.complianceScore.label}
            value={dashboardMetrics.complianceScore.value}
            trend={dashboardMetrics.complianceScore.trend}
            suffix="%"
            icon={ShieldCheck}
            color="emerald"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
          >
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-amber" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map(({ label, icon: Icon, href, color }) => (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5 lg:col-span-2"
          >
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-cyan" />
              Recent Activity
            </h2>
            <div className="space-y-0">
              {recentActivity.map((item, idx) => (
                <TimelineItem key={item.id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-5"
          >
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-emerald" />
              System Health
            </h2>
            <div className="space-y-3">
              {systemHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'operational' ? 'bg-accent-emerald animate-pulse' : 'bg-accent-amber animate-pulse'
                    }`} />
                    <span className="text-sm text-text-primary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">{item.uptime} uptime</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      item.status === 'operational'
                        ? 'bg-accent-emerald/10 text-accent-emerald'
                        : 'bg-accent-amber/10 text-accent-amber'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Knowledge Graph Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Share2 className="w-4 h-4 text-accent-purple" />
                Knowledge Graph
              </h2>
              <Link href="/graph">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-accent-blue hover:text-accent-blue/80 font-medium flex items-center gap-1 transition-colors"
                >
                  Explore <ArrowRight className="w-3 h-3" />
                </motion.button>
              </Link>
            </div>
            <div className="relative h-48 rounded-xl bg-bg-primary/50 border border-white/[0.04] flex items-center justify-center overflow-hidden">
              {/* Decorative animated nodes */}
              {[
                { x: 30, y: 25, color: '#3b82f6', size: 8, delay: 0 },
                { x: 70, y: 35, color: '#10b981', size: 6, delay: 0.2 },
                { x: 50, y: 60, color: '#8b5cf6', size: 10, delay: 0.4 },
                { x: 20, y: 70, color: '#f59e0b', size: 5, delay: 0.6 },
                { x: 80, y: 65, color: '#06b6d4', size: 7, delay: 0.8 },
                { x: 45, y: 30, color: '#f43f5e', size: 5, delay: 1.0 },
                { x: 65, y: 75, color: '#3b82f6', size: 6, delay: 1.2 },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 1.2, 1],
                    opacity: [0, 1, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: node.delay,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                  className="absolute rounded-full"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: node.size * 2,
                    height: node.size * 2,
                    backgroundColor: node.color,
                    boxShadow: `0 0 20px ${node.color}50`,
                  }}
                />
              ))}

              {/* Connecting lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
                <line x1="30%" y1="25%" x2="50%" y2="60%" stroke="white" strokeWidth="1" />
                <line x1="70%" y1="35%" x2="50%" y2="60%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="60%" x2="20%" y2="70%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="60%" x2="80%" y2="65%" stroke="white" strokeWidth="1" />
                <line x1="30%" y1="25%" x2="45%" y2="30%" stroke="white" strokeWidth="1" />
                <line x1="70%" y1="35%" x2="65%" y2="75%" stroke="white" strokeWidth="1" />
              </svg>

              <div className="relative z-10 text-center">
                <p className="text-xs text-text-muted font-medium">36 nodes · 55 relationships</p>
                <p className="text-[10px] text-text-muted mt-0.5">Click Explore to interact</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
