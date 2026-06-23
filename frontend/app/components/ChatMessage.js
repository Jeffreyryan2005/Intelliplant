'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function ChatMessage({ message, isStreaming = false }) {
  const isUser = message.role === 'user';
  const [showCitations, setShowCitations] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-accent-blue to-accent-purple'
          : 'bg-gradient-to-br from-accent-emerald to-accent-cyan'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Message Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-3xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-white/10 text-white rounded-tr-sm border border-white/5 backdrop-blur-md'
            : 'bg-transparent text-text-primary'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none
              prose-headings:text-text-primary prose-headings:font-semibold prose-headings:tracking-tight
              prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-3
              prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-[15px]
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-code:text-accent-cyan prose-code:bg-accent-cyan/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px]
              prose-table:text-[14px]
              prose-th:text-text-primary prose-th:bg-white/[0.02] prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border-b prose-th:border-white/10
              prose-td:text-text-secondary prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-white/[0.04]
              prose-li:text-text-secondary prose-li:text-[15px]
              prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
            ">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && <span className="typing-cursor text-accent-blue ml-1">▊</span>}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className={`text-[10px] text-text-muted mt-1 ${isUser ? 'text-right' : 'text-left'} px-1`}>
          {message.timestamp}
        </p>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowCitations(!showCitations)}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-blue transition-colors px-1"
            >
              <FileText className="w-3 h-3" />
              {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
              {showCitations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {showCitations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mt-2 overflow-hidden"
                >
                  {message.citations.map((cite, idx) => {
                    const confidence = cite.confidence || cite.relevance_score || 0;
                    const docName = cite.document || cite.title || 'Unknown Source';
                    const excerpt = cite.excerpt || cite.text_snippet || '';
                    const sectionOrPage = cite.page || cite.section || '';
                    
                    return (
                    <motion.div
                      key={cite.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card p-4 text-xs hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-medium text-text-primary flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-accent-blue" />
                          {docName}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {sectionOrPage && <span className="text-text-muted px-2 py-0.5 rounded bg-white/5">{sectionOrPage}</span>}
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            confidence >= 0.9
                              ? 'bg-accent-emerald/10 text-accent-emerald'
                              : confidence >= 0.8
                              ? 'bg-accent-amber/10 text-accent-amber'
                              : 'bg-accent-rose/10 text-accent-rose'
                          }`}>
                            {Math.round(confidence * 100)}% Match
                          </span>
                        </div>
                      </div>
                      <p className="text-text-muted leading-relaxed italic border-l-2 border-white/10 pl-3 ml-1 text-[13px]">&ldquo;{excerpt}&rdquo;</p>
                    </motion.div>
                  )})}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
