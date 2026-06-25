"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Sparkles, AlertCircle, Calendar, ChevronDown, ChevronUp, Tag } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Badge from "../components/Badge";

// Hardcoded Data
const lessonsStats = {
  totalLessons: 8,
  equipmentCovered: 6,
  highSeverity: 3,
  thisQuarter: 4
};

const allLessons = [
  {
    id: "LL-001",
    title: "Pump P-101A bearing failure due to misalignment after maintenance",
    category: "Mechanical",
    severity: "High",
    date: "2024-03-15",
    rootCause: "Improper laser alignment during reassembly led to excess vibration and premature bearing wear.",
    actions: ["Update pump maintenance SOP to require secondary sign-off on alignment", "Conduct refresher training on laser alignment tool calibration"],
    tags: ["P-101A", "bearing", "alignment"],
    relatedCount: 2
  },
  {
    id: "LL-002",
    title: "Heat exchanger E-103 tube leak from chloride stress corrosion",
    category: "Process",
    severity: "Critical",
    date: "2024-02-28",
    rootCause: "Accumulation of chlorides in the overhead circuit combined with temperature excursions during feed changeover.",
    actions: ["Automate wash water injection based on chloride content analyzer", "Inspect E-103 bundle during next turnaround"],
    tags: ["E-103", "corrosion", "chloride"],
    relatedCount: 4
  },
  {
    id: "LL-003",
    title: "CDU column C-101 tray damage during startup",
    category: "Process",
    severity: "High",
    date: "2024-01-20",
    rootCause: "Rapid heating rate caused water pockets to vaporize suddenly (steam explosion), lifting trays 12-15.",
    actions: ["Implement hard interlock on furnace heating rate", "Update startup SOP"],
    tags: ["C-101", "startup", "steam explosion"],
    relatedCount: 1
  },
  {
    id: "LL-004",
    title: "Fire water pump FWP-201 failed to start during drill",
    category: "Safety",
    severity: "Critical",
    date: "2024-04-10",
    rootCause: "Dead battery in the starting circuit. Battery charger was inadvertently disconnected.",
    actions: ["Install local audible alarm for battery charger power loss", "Add battery voltage check to daily operator rounds"],
    tags: ["FWP-201", "safety", "battery"],
    relatedCount: 0
  },
  {
    id: "LL-005",
    title: "Instrument air compressor K-301 tripped on high discharge temp",
    category: "Mechanical",
    severity: "Medium",
    date: "2024-03-22",
    rootCause: "Fouling of the intercooler cooling water tubes due to biological growth in the CW system.",
    actions: ["Review and adjust CW chemical dosing schedule", "Clean intercooler"],
    tags: ["K-301", "compressor", "fouling"],
    relatedCount: 3
  },
  {
    id: "LL-006",
    title: "LPG sphere S-101 relief valve PSV-103 failed to reseat",
    category: "Safety",
    severity: "High",
    date: "2024-05-05",
    rootCause: "Debris lodged in the valve seat during a lifting event.",
    actions: ["Replace PSV-103", "Update commissioning procedures for pressure vessels"],
    tags: ["S-101", "valve", "debris"],
    relatedCount: 1
  },
  {
    id: "LL-007",
    title: "Crude oil feed pump P-102B seal leak due to dry running",
    category: "Mechanical",
    severity: "High",
    date: "2024-04-18",
    rootCause: "Operator started pump with the suction valve inadvertently left closed.",
    actions: ["Implement pre-startup checklist for all pumps", "Install suction pressure low-low trip"],
    tags: ["P-102B", "seal", "dry run"],
    relatedCount: 2
  },
  {
    id: "LL-008",
    title: "DCS communication failure during CDU unit trip",
    category: "Electrical",
    severity: "Medium",
    date: "2024-02-10",
    rootCause: "Network switch overload due to broadcast storm during the trip event.",
    actions: ["Implement network segmentation for DCS switches", "Review alarm rationalization to reduce flood during trips"],
    tags: ["DCS-01", "network", "trip"],
    relatedCount: 0
  }
];

const categories = ["All", "Mechanical", "Electrical", "Process", "Safety"];

const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'rose';
    case 'high': return 'amber';
    case 'medium': return 'blue';
    case 'low': return 'emerald';
    default: return 'gray';
  }
};

const LessonCard = ({ lesson }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card border border-white/5 hover:border-white/10 transition-colors overflow-hidden flex flex-col h-full"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex space-x-2">
            <Badge color={getSeverityColor(lesson.severity)}>{lesson.severity}</Badge>
            <Badge color="purple">{lesson.category}</Badge>
          </div>
          <div className="flex items-center text-text-muted text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {lesson.date}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-text-primary leading-tight mb-3">
          {lesson.title}
        </h3>
        
        <div className="bg-white/5 p-3 rounded-lg mb-4">
          <span className="text-xs font-bold text-accent-cyan block mb-1">Root Cause</span>
          <p className="text-text-secondary text-sm line-clamp-3">{lesson.rootCause}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {lesson.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center text-xs bg-bg-secondary text-text-muted px-2 py-1 rounded-md border border-white/5">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="border-t border-white/5 bg-bg-secondary">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex justify-between items-center p-3 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <span className="flex items-center">
            {lesson.relatedCount > 0 && (
              <span className="bg-white/10 px-2 py-0.5 rounded text-xs mr-2">{lesson.relatedCount} Related</span>
            )}
            Corrective Actions
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 pb-4"
            >
              <ul className="list-disc pl-4 space-y-1 mt-2">
                {lesson.actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-text-secondary">{action}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function LessonsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = allLessons.filter(lesson => {
    const matchesCategory = activeFilter === "All" || lesson.category === activeFilter;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <header>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-accent-purple/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-accent-purple" />
            </div>
            <h1 className="text-3xl font-bold">Lessons Learned Engine</h1>
          </div>
          <p className="text-text-muted">Capturing knowledge from incidents to prevent recurrence</p>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 text-center">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Lessons</p>
            <h2 className="text-2xl font-bold text-accent-blue">{lessonsStats.totalLessons}</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 text-center">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Equipment Covered</p>
            <h2 className="text-2xl font-bold text-accent-emerald">{lessonsStats.equipmentCovered}</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">High Severity</p>
            <h2 className="text-2xl font-bold text-accent-rose">{lessonsStats.highSeverity}</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4 text-center">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">This Quarter</p>
            <h2 className="text-2xl font-bold text-accent-amber">{lessonsStats.thisQuarter}</h2>
          </motion.div>
        </div>

        {/* AI Recommendation Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 border border-accent-purple/30 bg-gradient-to-r from-accent-purple/5 to-transparent">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-accent-purple mt-0.5" />
            <div>
              <p className="font-medium text-text-primary text-sm mb-2">AI automatically recommends relevant lessons when similar failures are detected in RCA or new documents.</p>
              <div className="flex space-x-4">
                <div className="bg-bg-secondary px-3 py-2 rounded border border-white/5 text-xs">
                  <span className="text-accent-emerald mr-2 font-bold">95% Match</span>
                  <span className="text-text-secondary">P-101A Bearing Failure</span>
                </div>
                <div className="bg-bg-secondary px-3 py-2 rounded border border-white/5 text-xs">
                  <span className="text-accent-amber mr-2 font-bold">82% Match</span>
                  <span className="text-text-secondary">P-102B Seal Leak</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-secondary p-4 rounded-xl border border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search lessons, equipment, root cause..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent-purple/50 transition-colors"
            />
          </div>
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === cat 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-white/5 text-text-muted hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredLessons.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No lessons found</h3>
            <p className="text-text-muted">Try adjusting your search query or category filter.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
