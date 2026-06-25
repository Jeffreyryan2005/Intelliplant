'use client';

import { motion } from 'framer-motion';
import { 
  FileText, Image as ImageIcon, FileSpreadsheet, Mail, 
  Eye, Fingerprint, Share2, Database, Brain, Bot, 
  LayoutDashboard, MessageSquare, ArrowDown
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const ARCHITECTURE_STEPS = [
  {
    id: 'data',
    title: 'Unstructured Data Sources',
    desc: 'Ingesting enterprise data across multiple formats',
    color: 'slate',
    items: [
      { icon: FileText, label: 'PDFs & Manuals' },
      { icon: ImageIcon, label: 'P&IDs' },
      { icon: FileSpreadsheet, label: 'Excel Logs' },
      { icon: Mail, label: 'Emails' }
    ]
  },
  {
    id: 'vision',
    title: 'OCR + Vision AI',
    desc: 'Multi-modal processing for text and complex schematics',
    icon: Eye,
    color: 'rose'
  },
  {
    id: 'extraction',
    title: 'Entity Extraction',
    desc: 'Identifying equipment, chemicals, regulations, and failure modes',
    icon: Fingerprint,
    color: 'amber'
  },
  {
    id: 'graph',
    title: 'Knowledge Graph',
    desc: 'Mapping complex industrial relationships (Neo4j)',
    icon: Share2,
    color: 'cyan'
  },
  {
    id: 'rag',
    title: 'Vector DB + RAG',
    desc: 'Semantic search and retrieval-augmented generation',
    icon: Database,
    color: 'emerald'
  },
  {
    id: 'agents',
    title: 'Multi-Agent Swarm',
    desc: 'Specialized LLM agents for specific domains',
    icon: Brain,
    color: 'purple',
    items: [
      { icon: FileText, label: 'Document' },
      { icon: Fingerprint, label: 'Maintenance' },
      { icon: Share2, label: 'Compliance' },
      { icon: Bot, label: 'Lessons' }
    ]
  },
  {
    id: 'ui',
    title: 'Atlas AI OS Interface',
    desc: 'Unified Copilot and Dashboards',
    color: 'blue',
    items: [
      { icon: MessageSquare, label: 'Copilot' },
      { icon: LayoutDashboard, label: 'Dashboards' }
    ]
  }
];

export default function ArchitecturePage() {
  return (
    <PageTransition>
      <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Atlas <span className="text-gradient">AI</span> Architecture
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From unstructured industrial data to an intelligent, multi-agent operating system.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          {ARCHITECTURE_STEPS.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === ARCHITECTURE_STEPS.length - 1;
            
            return (
              <div key={step.id} className="relative flex flex-col items-center">
                
                {/* Arrow from previous step */}
                {!isFirst && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 32, opacity: 1 }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    className="w-px h-8 bg-gradient-to-b from-white/20 to-accent-blue/50 flex items-end justify-center mb-4"
                  >
                    <ArrowDown className="w-4 h-4 text-accent-blue/50 transform translate-y-3" />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 + 0.2 }}
                  className={`w-full glass-card p-6 border border-accent-${step.color}/20 hover:border-accent-${step.color}/50 transition-colors shadow-[0_0_30px_rgba(var(--accent-${step.color}-rgb),0.05)]`}
                >
                  <div className="flex flex-col items-center text-center">
                    
                    {step.icon && (
                      <div className={`w-12 h-12 rounded-2xl bg-accent-${step.color}/10 flex items-center justify-center mb-4`}>
                        <step.icon className={`w-6 h-6 text-accent-${step.color}`} />
                      </div>
                    )}
                    
                    <h3 className={`text-xl font-bold text-text-primary ${!step.icon ? 'mb-2' : 'mb-1'}`}>
                      {step.title}
                    </h3>
                    
                    <p className="text-sm text-text-muted mb-4">{step.desc}</p>

                    {step.items && (
                      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                        {step.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <item.icon className="w-4 h-4 text-text-secondary" />
                            <span className="text-xs font-medium text-text-secondary">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
