'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DocumentCard from '../components/DocumentCard';
import UploadZone from '../components/UploadZone';
import { documents } from '../lib/demoData';
import { uploadDocument } from '../lib/api';
import {
  FileText, Grid3X3, List, Search, Filter,
  SlidersHorizontal, X, Eye, Tag, Calendar,
  Layers, ChevronDown, ExternalLink,
} from 'lucide-react';

export default function DocumentsPage() {
  const [docs, setDocs] = useState(documents);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (filterType !== 'all' && doc.type !== filterType) return false;
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [docs, filterType, searchQuery]);

  const handleUpload = async (files) => {
    setUploading(true);
    const newUploaded = files.map((f) => ({ name: f.name, size: f.size, status: 'uploading' }));
    setUploadedFiles(newUploaded);

    for (const file of files) {
      const result = await uploadDocument(file);
      if (result?.document) {
        setDocs((prev) => [{ ...result.document, tags: [], description: 'Recently uploaded document — processing in progress.', pages: 0 }, ...prev]);
      }
    }

    setUploadedFiles((prev) => prev.map((f) => ({ ...f, status: 'done' })));
    setUploading(false);
    setTimeout(() => setUploadedFiles([]), 3000);
  };

  return (
    <PageTransition>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent-blue" />
            Document Hub
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Upload, process, and explore industrial documents with AI-powered entity extraction
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone
          onUpload={handleUpload}
          uploading={uploading}
          uploadedFiles={uploadedFiles}
          onRemoveFile={(idx) => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
        />

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <div className="flex items-center gap-1 glass-card px-1 py-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'pdf', label: 'PDF' },
                { value: 'spreadsheet', label: 'Sheets' },
                { value: 'image', label: 'Images' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === f.value
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 glass-card px-1 py-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'list' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs text-text-muted">
          Showing {filteredDocs.length} of {docs.length} documents
        </p>

        {/* Document Grid/List */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'space-y-3'
        }>
          {filteredDocs.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              index={idx}
              onView={(d) => setSelectedDoc(d)}
            />
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">No documents found</p>
            <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Document Detail Modal */}
        <AnimatePresence>
          {selectedDoc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDoc(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{selectedDoc.title}</h2>
                    <p className="text-sm text-text-secondary mt-1">Uploaded by {selectedDoc.uploadedBy} · {selectedDoc.uploadDate}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Doc Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-card p-3 text-center">
                    <Layers className="w-4 h-4 text-accent-blue mx-auto mb-1" />
                    <p className="text-lg font-bold text-text-primary">{selectedDoc.pages}</p>
                    <p className="text-[11px] text-text-muted">Pages</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <Tag className="w-4 h-4 text-accent-emerald mx-auto mb-1" />
                    <p className="text-lg font-bold text-text-primary">{selectedDoc.entityCount}</p>
                    <p className="text-[11px] text-text-muted">Entities</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <FileText className="w-4 h-4 text-accent-purple mx-auto mb-1" />
                    <p className="text-lg font-bold text-text-primary">{selectedDoc.size}</p>
                    <p className="text-[11px] text-text-muted">File Size</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Description</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{selectedDoc.description}</p>
                </div>

                {/* Tags */}
                {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-2">Entity Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoc.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20 cursor-pointer hover:bg-accent-blue/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Full Document
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl border border-white/10 text-text-primary text-sm font-medium hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View in Knowledge Graph
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
