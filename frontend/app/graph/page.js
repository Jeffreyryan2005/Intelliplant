'use client';

import { useState } from 'react';
import PageTransition from '../components/PageTransition';
import GraphViewer from '../components/GraphViewer';
import { graphNodes, graphEdges, nodeTypeConfig } from '../lib/demoData';
import { Share2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <PageTransition>
      <div className="h-[calc(100vh-4rem)] flex flex-col relative">
        {/* Title overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card px-4 py-2 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-accent-purple" />
            <h1 className="text-sm font-semibold text-text-primary">Knowledge Graph Explorer</h1>
            <span className="text-[10px] text-text-muted hidden sm:inline">· Interactive force-directed visualization</span>
          </motion.div>
        </div>

        {/* Graph fills entire page */}
        <GraphViewer
          nodes={graphNodes}
          edges={graphEdges}
          onNodeClick={setSelectedNode}
          height={typeof window !== 'undefined' ? window.innerHeight - 64 : 600}
        />

        {/* Info tooltip */}
        <div className="absolute bottom-4 right-4 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="glass-card px-3 py-2 flex items-center gap-2 text-[11px] text-text-muted"
          >
            <Info className="w-3 h-3" />
            Click nodes to explore · Scroll to zoom · Drag to pan
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
