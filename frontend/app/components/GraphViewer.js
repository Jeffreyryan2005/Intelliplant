'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ZoomIn, ZoomOut, Maximize2, Filter } from 'lucide-react';
import { nodeTypeConfig } from '@/app/lib/demoData';

// Dynamically import ForceGraph2D (it uses canvas and must be client-only)
import dynamic from 'next/dynamic';
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function GraphViewer({ nodes = [], edges = [], onNodeClick, height = 600 }) {
  const graphRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set(Object.keys(nodeTypeConfig)));
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height });
  const containerRef = useRef(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || height,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (!activeFilters.has(n.type)) return false;
      if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [nodes, activeFilters, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return edges.filter((e) => filteredNodeIds.has(e.source?.id || e.source) && filteredNodeIds.has(e.target?.id || e.target));
  }, [edges, filteredNodeIds]);

  const graphData = useMemo(() => ({
    nodes: filteredNodes.map((n) => ({ ...n })),
    links: filteredEdges.map((e) => ({ ...e })),
  }), [filteredNodes, filteredEdges]);

  const highlightedNodeId = useMemo(() => {
    if (!searchQuery) return null;
    const match = filteredNodes.find((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return match?.id;
  }, [searchQuery, filteredNodes]);

  const toggleFilter = (type) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(3, 500);
    }
  }, [onNodeClick]);

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const config = nodeTypeConfig[node.type] || { color: '#666', icon: '?' };
    const isHighlighted = node.id === highlightedNodeId;
    const isHovered = node.id === hoveredNode;
    const isSelected = node.id === selectedNode?.id;
    const baseSize = 6;
    const size = (isHighlighted || isHovered || isSelected) ? baseSize * 1.4 : baseSize;

    // Glow effect
    if (isHighlighted || isHovered || isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
      ctx.fillStyle = config.color + '30';
      ctx.fill();
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = config.color;
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#fff' : config.color + '60';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    // Label
    const labelFontSize = Math.max(10 / globalScale, 2.5);
    ctx.font = `${labelFontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(node.label, node.x, node.y + size + labelFontSize + 1);
  }, [highlightedNodeId, hoveredNode, selectedNode]);

  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;
    if (typeof start !== 'object' || typeof end !== 'object') return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Edge label
    if (globalScale > 1.5) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const fontSize = Math.max(8 / globalScale, 1.5);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.fillText(link.label || '', midX, midY);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col">
      {/* Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="glass-card flex items-center gap-2 px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-text-muted hover:text-text-primary">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="glass-card flex items-center gap-1 px-1 py-1">
          <button
            onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 300)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => graphRef.current?.zoom(graphRef.current.zoom() / 1.5, 300)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => graphRef.current?.zoomToFit(400, 50)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="glass-card px-3 py-2 hidden md:flex items-center gap-3 text-xs text-text-secondary">
          <span><strong className="text-text-primary">{filteredNodes.length}</strong> nodes</span>
          <span className="text-white/10">|</span>
          <span><strong className="text-text-primary">{filteredEdges.length}</strong> edges</span>
        </div>
      </div>

      {/* Filter Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-card p-3">
        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2">Filter by type</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(nodeTypeConfig).map(([type, config]) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeFilters.has(type)
                  ? 'bg-white/[0.08] text-text-primary'
                  : 'bg-white/[0.02] text-text-muted opacity-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.color, opacity: activeFilters.has(type) ? 1 : 0.3 }} />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1">
        {typeof window !== 'undefined' && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#0a0e1a"
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onNodeHover={(node) => setHoveredNode(node?.id || null)}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={50}
            cooldownTicks={100}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            enableZoomInteraction={true}
            enablePanInteraction={true}
          />
        )}
      </div>

      {/* Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-16 right-4 bottom-16 w-72 glass-card p-5 z-20 overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: nodeTypeConfig[selectedNode.type]?.color }}
                />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {nodeTypeConfig[selectedNode.type]?.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-4">{selectedNode.label}</h3>

            {selectedNode.details && (
              <div className="space-y-3">
                {Object.entries(selectedNode.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-medium text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Connected nodes */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Connected To</h4>
              <div className="space-y-2">
                {edges
                  .filter((e) => (e.source?.id || e.source) === selectedNode.id || (e.target?.id || e.target) === selectedNode.id)
                  .slice(0, 8)
                  .map((e, i) => {
                    const connectedId = (e.source?.id || e.source) === selectedNode.id ? (e.target?.id || e.target) : (e.source?.id || e.source);
                    const connectedNode = nodes.find((n) => n.id === connectedId);
                    return connectedNode ? (
                      <button
                        key={i}
                        onClick={() => handleNodeClick(connectedNode)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.04] text-left transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: nodeTypeConfig[connectedNode.type]?.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{connectedNode.label}</p>
                          <p className="text-[10px] text-text-muted">{e.label}</p>
                        </div>
                      </button>
                    ) : null;
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
