'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Eye, Share2, Wrench, ShieldCheck, BookOpen, Brain, CheckCircle2, Bot, Loader2, X
} from 'lucide-react';

const DEMO_STEPS = [
  { id: 'upload', title: 'Ingesting P&ID', agent: 'Document Agent', icon: FileText, duration: 2500, detail: 'BPL-PID-CDU-001.pdf parsed.' },
  { id: 'vision', title: 'Vision AI Extraction', agent: 'Vision Agent', icon: Eye, duration: 3000, detail: 'Identified 12 equipment assets, 42 instruments.' },
  { id: 'graph', title: 'Knowledge Graph Sync', agent: 'Knowledge Agent', icon: Share2, duration: 2500, detail: 'Linking P-101A to thermal cycling failure modes.' },
  { id: 'rca', title: 'Predictive RCA', agent: 'Maintenance Agent', icon: Wrench, duration: 3000, detail: 'Seal leak predicted. MTBF: 180 days.' },
  { id: 'compliance', title: 'Regulatory Audit', agent: 'Compliance Agent', icon: ShieldCheck, duration: 2500, detail: 'OISD-117 violation: Low fire water pressure.' },
  { id: 'lessons', title: 'Historical DB Query', agent: 'Lessons Agent', icon: BookOpen, duration: 2500, detail: 'Warning: Matches 2023 Pump P-102B blowout.' },
  { id: 'compile', title: 'Compiling Report', agent: 'Atlas OS', icon: Brain, duration: 2000, detail: 'Synthesizing multi-agent intelligence.' }
];

export default function DemoOverlay({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    
    const runDemo = async () => {
      for (let i = 0; i < DEMO_STEPS.length; i++) {
        if (isCancelled) return;
        setCurrentStep(i);
        await new Promise(r => setTimeout(r, DEMO_STEPS[i].duration));
      }
      if (!isCancelled) {
        setShowResult(true);
      }
    };

    runDemo();

    return () => { isCancelled = true; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/90 backdrop-blur-md p-4">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border border-accent-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] rounded-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 lg:p-6 border-b border-white/[0.06] bg-bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Atlas AI <span className="text-gradient">Live Demo</span></h2>
              <p className="text-xs text-text-muted">Multi-Agent Swarm Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 lg:p-10 flex-1">
          {!showResult ? (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-emerald"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / DEMO_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {DEMO_STEPS.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isPast = idx < currentStep;
                  
                  return (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`relative p-4 rounded-xl border transition-all duration-300 ${
                        isActive ? 'bg-accent-blue/10 border-accent-blue/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 
                        isPast ? 'bg-white/5 border-white/10 opacity-70' : 
                        'bg-white/[0.02] border-white/5 opacity-40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-accent-blue text-white' : 
                          isPast ? 'bg-accent-emerald/20 text-accent-emerald' : 
                          'bg-white/5 text-text-muted'
                        }`}>
                          {isPast ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-accent-cyan">{step.agent}</span>
                          </div>
                          <h4 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-text-primary'}`}>{step.title}</h4>
                          <AnimatePresence>
                            {(isActive || isPast) && (
                              <motion.p 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-text-muted mt-2"
                              >
                                {step.detail}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Central Pulsing Brain */}
              <div className="flex justify-center mt-12 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-blue rounded-full animate-ping opacity-20" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
                    <Brain className="w-10 h-10 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-text-secondary animate-pulse">
                Swarm intelligence processing...
              </p>

            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent-emerald/20 flex items-center justify-center border border-accent-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8 text-accent-emerald" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white text-center mb-6">Comprehensive Analysis Complete</h3>
              
              <div className="space-y-4">
                <div className="glass-card p-5 border-l-4 border-accent-blue">
                  <h4 className="text-sm font-bold text-accent-blue uppercase tracking-wider mb-2 flex items-center gap-2"><Wrench className="w-4 h-4"/> Maintenance Intelligence (RCA)</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Root cause analysis indicates a recurring mechanical seal failure mode on Pump P-101A linked to thermal cycling during startup. MTBF has dropped to 180 days. 
                    <br/><strong className="text-white mt-2 inline-block">Recommendation:</strong> Install thermal sleeve and modify startup SOP to include a gradual warm-up phase. Estimated cost savings: ₹3.2L/year.
                  </p>
                </div>

                <div className="glass-card p-5 border-l-4 border-accent-emerald">
                  <h4 className="text-sm font-bold text-accent-emerald uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Regulatory Compliance Audit</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Checked P-101A against OISD-117 and PESO regulations. The surrounding fire water network pressure is below the required 7 kg/cm² (currently at 6.2 kg/cm²).
                    <br/><strong className="text-white mt-2 inline-block">Action Required:</strong> Install a jockey pump at the dead-end section to restore compliance.
                  </p>
                </div>

                <div className="glass-card p-5 border-l-4 border-accent-rose">
                  <h4 className="text-sm font-bold text-accent-rose uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Lessons Learned Warning</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Historical incident database query triggered a high-severity warning: A similar thermal cycling issue on Pump P-102B in 2023 led to a catastrophic seal blowout and minor fire.
                    <br/><strong className="text-white mt-2 inline-block">Urgent Action:</strong> Accelerate thermal sleeve installation before the next scheduled PM.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
