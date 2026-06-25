'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ChatMessage from '../components/ChatMessage';
import { demoChatMessages, suggestedQuestions, chatConversations } from '../lib/demoData';
import {
  Send, Paperclip, MessageSquare, Plus, Clock,
  Sparkles, Zap, Brain, ChevronRight, Settings,
  Bot, RotateCcw, Lightbulb, ShieldCheck, Wrench, FileText, Share2, Eye, BookOpen,
} from 'lucide-react';

export default function CopilotPage() {
  const [messages, setMessages] = useState(demoChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [mode, setMode] = useState('quick'); // 'quick' | 'deep'
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingMessage, scrollToBottom]);

  const simulateStreaming = async (text, citations = []) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsTyping(false);

    const words = text.split(' ');
    let current = '';
    setStreamingMessage({ id: `msg-stream`, role: 'assistant', content: '', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), citations: [] });

    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      setStreamingMessage((prev) => ({ ...prev, content: current }));
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
    }

    const finalMsg = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      citations,
    };
    setStreamingMessage(null);
    setMessages((prev) => [...prev, finalMsg]);
  };

  const demoResponses = {
    default: {
      text: `Based on the available documentation and knowledge base, here's what I found:

## Analysis Summary

The query has been processed against **1,247 indexed documents** spanning equipment manuals, P&ID drawings, maintenance logs, and regulatory standards.

### Key Findings

1. **Relevant documents identified**: 3 primary sources matched your query with high confidence
2. **Cross-referenced** with maintenance history and compliance records
3. **Equipment relationships** mapped through the knowledge graph

### Recommendation

I recommend reviewing the linked source documents for detailed specifications. The knowledge graph shows 12 connected entities that may provide additional context.

> **Note**: For real-time equipment parameters, please verify against the latest DCS readings.`,
      citations: [
        { id: 'c1', document: 'CDU Unit P&ID Drawing Rev.12', excerpt: 'Reference drawing showing process connections and instrumentation...', page: 4, confidence: 0.92 },
        { id: 'c2', document: 'Equipment Data Sheet — Process Summary', excerpt: 'Operating parameters and design conditions for all major equipment...', page: 1, confidence: 0.87 },
      ],
    },
    'p-101a': {
      text: `I have engaged the full agent swarm to analyze Pump P-101A across all domains. Here is the comprehensive report:

### 🛠️ Maintenance Agent (RCA)
Root cause analysis indicates a recurring seal failure mode linked to thermal cycling during startup. The MTBF has dropped to 180 days. 
**Recommendation**: Install thermal sleeve and modify the startup procedure to include a gradual warm-up phase. Estimated cost savings: ₹3.2L/year.

### 🛡️ Compliance Agent
Checked P-101A against OISD-117 and PESO regulations. 
**Finding**: The surrounding fire water network pressure is below the required 7 kg/cm² (currently at 6.2 kg/cm²). 
**Action**: Install a jockey pump at the dead-end section to maintain compliance.

### 📚 Lessons Agent
Searched historical incident database for similar centrifugal pump failures.
**Warning**: A similar thermal cycling issue on Pump P-102B in 2023 led to a catastrophic seal blowout and minor fire. 
**Action**: Highly recommend accelerating the thermal sleeve installation before the next scheduled PM in July 2026.

### 🕸️ Knowledge Graph Agent
I've updated the graph to link Pump P-101A -> "Thermal Cycling" (Failure Mode) -> "Pump Startup SOP" (Procedure). 
The SOP document needs to be updated to reflect the new gradual warm-up phase.`,
      citations: [
        { id: 'c1', document: 'Pump P-101A Maintenance History', excerpt: '...recurring mechanical seal leaks observed post-startup...', page: 3, confidence: 0.98 },
        { id: 'c2', document: 'Incident Report IR-2023-04', excerpt: '...P-102B seal blowout caused by rapid thermal expansion...', page: 1, confidence: 0.94 },
        { id: 'c3', document: 'OISD-117 Compliance Checklist', excerpt: '...fire water network pressure must be maintained at 7 kg/cm²...', page: 12, confidence: 0.99 },
      ]
    },
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || streamingMessage) return;

    const query = input.trim();
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setActiveAgent(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://intelliplant-f25r.onrender.com'}/api/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let currentContent = '';
      let citations = [];
      setIsTyping(false);
      setStreamingMessage({ id: `msg-stream`, role: 'assistant', content: '', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), citations: [] });

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.type === 'agent') {
                  setActiveAgent(data.agent_name);
                } else if (data.type === 'citations') {
                  citations = data.citations;
                  setStreamingMessage(prev => ({ ...prev, citations }));
                } else if (data.type === 'chunk') {
                  currentContent += data.content;
                  setStreamingMessage(prev => ({ ...prev, content: currentContent }));
                } else if (data.type === 'done') {
                  done = true;
                }
              } catch (e) {
                console.warn('Error parsing SSE:', e);
              }
            }
          }
        }
      }

      setStreamingMessage(null);
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: currentContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        citations,
      }]);

    } catch (error) {
      console.error('Chat error, falling back to demo:', error);
      setIsTyping(false);
      setStreamingMessage(null);
      setActiveAgent(null);
      // Get relevant demo response based on query keywords
      const q = query.toLowerCase();
      let demo = demoResponses.default;
      if (q.includes('pressure') || q.includes('v-301')) demo = demoResponses['v-301'] || demoResponses.default;
      if (q.includes('p-101') || q.includes('pump') || q.includes('analysis')) demo = demoResponses['p-101a'] || demoResponses.default;
      await simulateStreaming(demo.text, demo.citations);
    }
  };

  const handleSuggestion = (q) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversation History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="border-r border-white/[0.06] bg-bg-primary overflow-hidden flex-shrink-0"
            >
              <div className="p-4 space-y-4 w-[280px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">History</h3>
                  <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {chatConversations.map((conv) => (
                    <button
                      key={conv.id}
                      className="w-full text-left p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                    >
                      <p className="text-sm text-text-primary truncate group-hover:text-accent-blue transition-colors">
                        {conv.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span className="text-[11px] text-text-muted">{conv.time}</span>
                        <span className="text-[11px] text-text-muted">· {conv.messageCount} messages</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Brain className="w-4 h-4 text-accent-purple" />
                  Atlas AI Copilot
                </h2>
                <p className="text-[11px] text-text-muted">Industrial Brain OS assistant</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 glass-card px-1 py-1">
              <button
                onClick={() => setMode('quick')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mode === 'quick' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Zap className="w-3 h-3" />
                Quick
              </button>
              <button
                onClick={() => setMode('deep')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mode === 'deep' ? 'bg-accent-purple/10 text-accent-purple' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Brain className="w-3 h-3" />
                Deep Analysis
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
            {messages.length === 0 && !streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-5xl mx-auto"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/20 flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-accent-blue" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">Unified Asset & Operations Brain</h3>
                <p className="text-sm text-text-secondary max-w-xl mb-10">
                  Ask me anything about plant operations, equipment, maintenance procedures, or regulatory compliance.
                  Your query will be routed to the appropriate specialized AI agent.
                </p>

                {/* Multi-Agent Swarm Dashboard */}
                <div className="w-full mb-10">
                  <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-emerald" /> Available Swarm Agents
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                    <div className="glass-card p-4 hover:border-accent-blue/50 transition-colors">
                      <FileText className="w-6 h-6 text-accent-blue mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">Document Agent</h5>
                      <p className="text-xs text-text-muted">Extracts entities & text from PDFs and manuals</p>
                    </div>
                    <div className="glass-card p-4 hover:border-accent-amber/50 transition-colors">
                      <Wrench className="w-6 h-6 text-accent-amber mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">Maintenance Agent</h5>
                      <p className="text-xs text-text-muted">Performs RCA and predicts equipment failures</p>
                    </div>
                    <div className="glass-card p-4 hover:border-accent-emerald/50 transition-colors">
                      <ShieldCheck className="w-6 h-6 text-accent-emerald mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">Compliance Agent</h5>
                      <p className="text-xs text-text-muted">Audits against OISD, PESO & IS codes</p>
                    </div>
                    <div className="glass-card p-4 hover:border-accent-purple/50 transition-colors">
                      <BookOpen className="w-6 h-6 text-accent-purple mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">Lessons Agent</h5>
                      <p className="text-xs text-text-muted">Flags similar historical incidents & near-misses</p>
                    </div>
                    <div className="glass-card p-4 hover:border-accent-cyan/50 transition-colors">
                      <Share2 className="w-6 h-6 text-accent-cyan mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">Knowledge Agent</h5>
                      <p className="text-xs text-text-muted">Traverses graph for complex relationships</p>
                    </div>
                    <div className="glass-card p-4 hover:border-accent-rose/50 transition-colors bg-accent-rose/5">
                      <Eye className="w-6 h-6 text-accent-rose mb-2" />
                      <h5 className="font-semibold text-text-primary text-sm mb-1">P&ID Vision Agent</h5>
                      <p className="text-xs text-text-muted">Analyzes schematics with multi-modal LLM</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                  {suggestedQuestions.slice(0, 4).map((q) => (
                    <motion.button
                      key={q}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestion(q)}
                      className="text-left p-3 rounded-xl glass-card glass-card-hover text-xs text-text-secondary hover:text-text-primary transition-colors flex items-start gap-2"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-accent-amber flex-shrink-0 mt-0.5" />
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {streamingMessage && (
              <ChatMessage message={streamingMessage} isStreaming={true} />
            )}

            {isTyping && !streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-emerald to-accent-cyan flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-accent-blue"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (when messages exist) */}
          {messages.length > 0 && !isTyping && !streamingMessage && (
            <div className="px-4 lg:px-6 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    className="text-[11px] px-3 py-1.5 rounded-lg glass-card text-text-muted hover:text-text-primary hover:border-accent-blue/20 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 lg:px-6 border-t border-white/[0.06]">
            {activeAgent && (
              <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-accent-emerald border border-accent-emerald/20 bg-accent-emerald/5 mb-3 max-w-4xl mx-auto rounded-lg">
                <Bot className="w-3 h-3" />
                <span className="font-medium">{activeAgent}</span>
                <span className="text-text-muted">is processing your query...</span>
              </div>
            )}
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <button className="w-10 h-10 rounded-xl hover:bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 glass-card p-1 flex items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about equipment, procedures, compliance..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none px-3 py-2 max-h-32"
                  style={{ minHeight: '40px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || !!streamingMessage}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-blue/20'
                      : 'text-text-muted'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-2">
              Atlas AI searches across {12487} documents and {84320} knowledge entities
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
