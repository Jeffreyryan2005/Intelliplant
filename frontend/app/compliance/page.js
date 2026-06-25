'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, FileCheck, Calendar, ArrowRight, Download, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

import ComplianceGauge from '../components/ComplianceGauge';
import Badge from '../components/Badge';
import PageTransition from '../components/PageTransition';
import { getComplianceOverview } from '../lib/api';

export default function CompliancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const complianceData = await getComplianceOverview();
        setData(complianceData);
        if (complianceData?.regulations?.length > 0) {
          setSelectedReg(complianceData.regulations[0]);
        }
      } catch (err) {
        console.error('Failed to load compliance data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) return null; // Handled by loading.js

  const handleGenerateEvidence = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('Evidence package generated successfully. Download started.');
    }, 2000);
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="w-4 h-4 text-accent-rose" />;
      case 'major': return <AlertCircle className="w-4 h-4 text-accent-amber" />;
      case 'minor': return <AlertCircle className="w-4 h-4 text-accent-blue" />;
      default: return <AlertCircle className="w-4 h-4 text-text-muted" />;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-accent-rose/10 text-accent-rose border-accent-rose/20';
      case 'major': return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
      case 'minor': return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
      default: return 'bg-white/5 text-text-muted border-white/10';
    }
  };

  return (
    <PageTransition>
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Compliance Tracker</h1>
            <p className="text-text-muted">Automated regulatory adherence and gap analysis.</p>
          </div>
          <button 
            onClick={handleGenerateEvidence}
            disabled={generating}
            className="btn-primary flex items-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Compiling...</>
            ) : (
              <><Download className="w-4 h-4" /> Generate Evidence Package</>
            )}
          </button>
        </div>

        {/* Top Section: Overall Score & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Gauge */}
          <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px]">
            <ComplianceGauge score={data.overallScore} size={220} label="Plant Overall Compliance" />
          </div>

          {/* Key Metrics */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent-blue/10 text-accent-blue">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Regulations Tracked</p>
                <p className="text-2xl font-bold text-text-primary">{data.regulations.length}</p>
                <p className="text-xs text-text-muted mt-1">OISD, PESO, IS Codes, Factory Act</p>
              </div>
            </div>
            
            <div className="glass-card p-5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent-amber/10 text-accent-amber">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Total Open Gaps</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data.regulations.reduce((acc, reg) => acc + reg.gapCount, 0)}
                </p>
                <p className="text-xs text-text-muted mt-1">Across all tracked standards</p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent-emerald/10 text-accent-emerald">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Checks Passed</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data.regulations.reduce((acc, reg) => acc + reg.passedChecks, 0)} / {data.regulations.reduce((acc, reg) => acc + reg.totalChecks, 0)}
                </p>
                <p className="text-xs text-accent-emerald mt-1">Auto-verified by AI</p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent-purple/10 text-accent-purple">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Next Major Audit</p>
                <p className="text-xl font-bold text-text-primary">Aug 15, 2026</p>
                <p className="text-xs text-text-muted mt-1">OISD-117 Fire Protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations List & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] overflow-hidden">
          
          {/* Sidebar: Regulations List */}
          <div className="glass-card flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-white/[0.05]">
              <h3 className="font-semibold text-text-primary">Regulations</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
              {data.regulations.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedReg(reg)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedReg?.id === reg.id 
                      ? 'bg-accent-blue/10 border border-accent-blue/20' 
                      : 'hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-text-primary text-sm">{reg.name}</span>
                    <span className={`text-xs font-bold ${reg.score >= 90 ? 'text-accent-emerald' : reg.score >= 80 ? 'text-accent-amber' : 'text-accent-rose'}`}>
                      {reg.score}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-text-muted">
                    <span>{reg.gapCount} Gaps</span>
                    <ChevronRight className={`w-4 h-4 ${selectedReg?.id === reg.id ? 'text-accent-blue opacity-100' : 'opacity-0'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content: Selected Regulation Details */}
          {selectedReg && (
            <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden h-full">
              {/* Detail Header */}
              <div className="p-6 border-b border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">{selectedReg.name}</h2>
                  <p className="text-sm text-text-muted">{selectedReg.fullName}</p>
                </div>
                <div className="flex items-center gap-6 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Score</p>
                    <p className={`text-xl font-bold ${selectedReg.score >= 90 ? 'text-accent-emerald' : selectedReg.score >= 80 ? 'text-accent-amber' : 'text-accent-rose'}`}>
                      {selectedReg.score}%
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Next Audit</p>
                    <p className="text-sm font-semibold text-text-primary" suppressHydrationWarning>
                      {new Date(selectedReg.nextAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gap Analysis Table */}
              <div className="p-6 flex-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-accent-amber" /> Identified Gaps
                </h3>
                
                <div className="flex-1 overflow-auto custom-scrollbar border border-white/[0.05] rounded-xl bg-[#0a0e1a]/50">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#111827] sticky top-0 z-10 text-text-muted">
                      <tr>
                        <th className="p-4 font-medium border-b border-white/[0.05]">Severity</th>
                        <th className="p-4 font-medium border-b border-white/[0.05]">Description</th>
                        <th className="p-4 font-medium border-b border-white/[0.05]">Equipment/Area</th>
                        <th className="p-4 font-medium border-b border-white/[0.05]">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {selectedReg.gaps.map((gap, i) => (
                        <motion.tr 
                          key={i}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityClass(gap.severity)}`}>
                              {getSeverityIcon(gap.severity)}
                              {gap.severity}
                            </span>
                          </td>
                          <td className="p-4 text-text-primary min-w-[200px]">{gap.description}</td>
                          <td className="p-4 text-text-secondary">
                            <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded">
                              {gap.equipment}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary">{gap.action}</td>
                        </motion.tr>
                      ))}
                      {selectedReg.gaps.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-text-muted">
                            <ShieldCheck className="w-12 h-12 text-accent-emerald/50 mx-auto mb-3" />
                            <p>No compliance gaps identified for this regulation.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageTransition>
  );
}

// Simple helper component for the chevron icon
function ChevronRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
