'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Activity, AlertTriangle, Calendar, Settings, Wrench, X, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

import EquipmentCard from '../components/EquipmentCard';
import TimelineItem from '../components/TimelineItem';
import Badge from '../components/Badge';
import PageTransition from '../components/PageTransition';
import { getMaintenanceDashboard } from '../lib/api';

const COLORS = {
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

export default function MaintenancePage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEq, setSelectedEq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRca, setShowRca] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMaintenanceDashboard();
        setEquipmentList(data || []);
      } catch (err) {
        console.error('Failed to load maintenance data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return null; // handled by loading.js

  // Fleet Analytics Data Prep
  const healthyCount = equipmentList.filter(e => e.status === 'healthy').length;
  const warningCount = equipmentList.filter(e => e.status === 'warning').length;
  const criticalCount = equipmentList.filter(e => e.status === 'critical').length;

  const mtbfData = equipmentList.map(e => ({ name: e.tag, mtbf: e.mtbf })).sort((a, b) => a.mtbf - b.mtbf);
  
  // Aggregate failures
  const allFailures = {};
  equipmentList.forEach(eq => {
    eq.failureHistory?.forEach(fh => {
      allFailures[fh.mode] = (allFailures[fh.mode] || 0) + fh.count;
    });
  });
  const failurePieData = Object.keys(allFailures).map(key => ({
    name: key,
    value: allFailures[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  
  const PIE_COLORS = [COLORS.rose, COLORS.amber, COLORS.blue, COLORS.purple, COLORS.cyan];

  return (
    <PageTransition>
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Maintenance Intelligence</h1>
          <p className="text-text-muted">Predictive analytics and equipment health monitoring.</p>
        </div>

        {/* Fleet Overview */}
        {!selectedEq && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Health Summary */}
            <div className="glass-card p-6 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Fleet Health</h3>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-emerald mb-1">{healthyCount}</div>
                  <div className="text-xs text-text-muted flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-amber mb-1">{warningCount}</div>
                  <div className="text-xs text-text-muted flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-rose mb-1">{criticalCount}</div>
                  <div className="text-xs text-text-muted flex items-center justify-center gap-1"><Activity className="w-3 h-3" /> Critical</div>
                </div>
              </div>
            </div>

            {/* Failure Distribution */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Top Failure Modes</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={failurePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                      {failurePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#f1f5f9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MTBF Chart */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">MTBF (Lowest 5)</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mtbfData.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="mtbf" fill={COLORS.blue} radius={[0, 4, 4, 0]} barSize={20}>
                      {mtbfData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.mtbf < 200 ? COLORS.rose : entry.mtbf < 300 ? COLORS.amber : COLORS.emerald} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Equipment List or Detail View */}
        <AnimatePresence mode="wait">
          {!selectedEq ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Equipment Roster</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {equipmentList.map((eq, idx) => (
                  <EquipmentCard key={eq.id} equipment={eq} index={idx} onClick={setSelectedEq} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setSelectedEq(null)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Fleet
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col: Main Info & RCA */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Header Card */}
                  <div className="glass-card p-6 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-mono text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-md">{selectedEq.tag}</span>
                        <Badge variant={selectedEq.status === 'healthy' ? 'success' : selectedEq.status === 'warning' ? 'warning' : 'danger'}>
                          {selectedEq.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-text-primary mb-1">{selectedEq.name}</h2>
                      <p className="text-text-muted">{selectedEq.type} • {selectedEq.unit}</p>
                    </div>
                    
                    <div className="flex gap-8 text-center bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                      <div>
                        <p className="text-xs text-text-muted mb-1">Health Score</p>
                        <p className={`text-3xl font-bold ${selectedEq.healthScore >= 85 ? 'text-accent-emerald' : selectedEq.healthScore >= 70 ? 'text-accent-amber' : 'text-accent-rose'}`}>
                          {selectedEq.healthScore}%
                        </p>
                      </div>
                      <div className="w-px bg-white/10"></div>
                      <div>
                        <p className="text-xs text-text-muted mb-1">MTBF</p>
                        <p className="text-3xl font-bold text-text-primary">{selectedEq.mtbf}<span className="text-sm font-normal text-text-muted ml-1">days</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Failure History Chart */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-accent-blue" /> Failure Pattern Analysis
                    </h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedEq.failureHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="mode" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <RechartsTooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                            contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                          />
                          <Bar dataKey="count" fill={COLORS.blue} radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {selectedEq.failureHistory?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.blue : COLORS.cyan} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Root Cause Analysis */}
                  {selectedEq.rcaAnalysis && (
                    <div className="glass-card p-0 overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-purple to-accent-blue"></div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent-purple" /> AI Root Cause Analysis
                          </h3>
                          <button 
                            onClick={() => setShowRca(!showRca)}
                            className="text-xs bg-accent-purple/20 text-accent-purple px-3 py-1.5 rounded-full hover:bg-accent-purple/30 transition-colors"
                          >
                            {showRca ? 'Hide Details' : 'View Generation'}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {showRca ? (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-text-secondary leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/[0.05]"
                            >
                              <p>{selectedEq.rcaAnalysis}</p>
                              <div className="mt-4 flex gap-2">
                                <button className="btn-primary text-xs py-1.5">Create Work Order</button>
                                <button className="btn-secondary text-xs py-1.5">View Related SOPs</button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.p className="text-sm text-text-secondary line-clamp-2">
                              {selectedEq.rcaAnalysis}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Col: Timeline & Actions */}
                <div className="space-y-6">
                  
                  {/* Maintenance Schedule */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent-amber" /> Schedule
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <div>
                          <p className="text-xs text-text-muted mb-0.5">Last Maintenance</p>
                          <p className="text-sm font-medium text-text-primary" suppressHydrationWarning>
                            {new Date(selectedEq.lastMaintenance).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-accent-emerald/50" />
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/20">
                        <div>
                          <p className="text-xs text-accent-amber mb-0.5">Next Predicted PM</p>
                          <p className="text-sm font-medium text-text-primary" suppressHydrationWarning>
                            {new Date(selectedEq.nextMaintenance).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <Wrench className="w-5 h-5 text-accent-amber" />
                      </div>
                    </div>
                  </div>

                  {/* History Timeline */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-text-muted" /> Maintenance History
                    </h3>
                    <div className="relative pl-3">
                      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
                      <div className="space-y-6 relative">
                        {selectedEq.maintenanceHistory?.map((hist, idx) => (
                          <div key={idx} className="relative pl-6">
                            <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#1a1f35] ${hist.type === 'Preventive' ? 'bg-accent-emerald' : 'bg-accent-rose'}`} />
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-xs font-semibold text-text-primary" suppressHydrationWarning>
                                {new Date(hist.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${hist.type === 'Preventive' ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-accent-rose/20 text-accent-rose'}`}>
                                {hist.type}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{hist.description}</p>
                            <div className="flex items-center gap-4 text-xs text-text-muted">
                              <span>Cost: ₹{hist.cost.toLocaleString()}</span>
                              <span>Time: {hist.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
