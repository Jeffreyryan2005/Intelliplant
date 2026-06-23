'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

export default function UploadZone({ onUpload, uploading = false, uploadedFiles = [], onRemoveFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (onUpload) onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragActive ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        }}
        whileHover={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
        className={`upload-zone rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'drag-active' : ''
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{
            y: isDragActive ? -5 : 0,
            scale: isDragActive ? 1.1 : 1,
          }}
          className="flex flex-col items-center gap-4"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isDragActive
              ? 'bg-accent-blue/20 border border-accent-blue/30'
              : 'bg-white/[0.04] border border-white/[0.06]'
          } transition-colors`}>
            {uploading ? (
              <Loader2 className="w-7 h-7 text-accent-blue animate-spin" />
            ) : (
              <Upload className={`w-7 h-7 ${isDragActive ? 'text-accent-blue' : 'text-text-muted'} transition-colors`} />
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary mb-1">
              {isDragActive ? 'Drop files here' : uploading ? 'Processing...' : 'Drag & drop documents here'}
            </p>
            <p className="text-sm text-text-muted">
              {uploading ? 'Extracting knowledge from your documents' : 'or click to browse — PDF, images, spreadsheets supported'}
            </p>
          </div>
          {!uploading && !isDragActive && (
            <div className="flex items-center gap-2 mt-2">
              {['PDF', 'PNG', 'XLSX', 'CSV'].map((ext) => (
                <span key={ext} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] text-text-muted border border-white/[0.06]">
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-accent-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                <p className="text-[11px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {file.status === 'uploading' ? (
                <Loader2 className="w-4 h-4 text-accent-blue animate-spin" />
              ) : (
                <button
                  onClick={() => onRemoveFile?.(idx)}
                  className="w-7 h-7 rounded-lg hover:bg-accent-rose/10 flex items-center justify-center text-text-muted hover:text-accent-rose transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
