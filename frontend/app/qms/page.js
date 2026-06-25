"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, AlertTriangle, AlertCircle, PlusCircle, Activity, FileText } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Badge from "../components/Badge";

// Hardcoded data for QMS
const stats = {
  openCapas: 5,
  activeMocs: 3,
  auditEvents: 12
};

const capas = [
  { id: "CAPA-001", title: "Replace corroded flange gasket on E-103", severity: "high", status: "in_progress", equipment: "E-103", dueDate: "2024-07-15" },
  { id: "CAPA-002", title: "Install vibration monitoring on P-101A", severity: "medium", status: "open", equipment: "P-101A", dueDate: "2024-08-01" },
  { id: "CAPA-003", title: "Update SOP for CDU startup sequence", severity: "low", status: "closed", equipment: "C-101", dueDate: "2024-06-30" },
  { id: "CAPA-004", title: "Repair fire water header pressure drop", severity: "critical", status: "open", equipment: "FWH-201", dueDate: "2024-07-05" },
  { id: "CAPA-005", title: "Calibrate PSV-103 relief valve", severity: "high", status: "in_progress", equipment: "PSV-103", dueDate: "2024-07-20" }
];

const auditTrail = [
  { id: "AT-008", event: "Compliance gap detected in OISD-117", time: "2 hours ago", user: "System" },
  { id: "AT-007", event: "AI RCA performed on P-101A", time: "4 hours ago", user: "R. Sharma" },
  { id: "AT-006", event: "Document BPL-MAINT-2024-0147 uploaded", time: "5 hours ago", user: "A. Rao" },
  { id: "AT-005", event: "CAPA-005 created", time: "1 day ago", user: "Safety-Officer" },
  { id: "AT-004", event: "MOC-002 submitted for review", time: "2 days ago", user: "Process-Eng" },
  { id: "AT-003", event: "CAPA-004 status changed to Open", time: "3 days ago", user: "Ops-Shift-Lead" },
];

const mocs = [
  { id: "MOC-001", title: "Replace P-101A impeller material from CI to SS316", status: "Approved", risk: "Medium" },
  { id: "MOC-002", title: "Reroute CDU overhead vapor line", status: "Pending Review", risk: "High" },
  { id: "MOC-003", title: "Install additional PSV on C-101 overhead", status: "Implemented", risk: "Low" }
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'rose';
    case 'high': return 'amber';
    case 'medium': return 'blue';
    case 'low': return 'emerald';
    default: return 'gray';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'rose';
    case 'in_progress': return 'amber';
    case 'closed': return 'emerald';
    default: return 'gray';
  }
};

export default function QMSPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-accent-blue/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-accent-blue" />
              </div>
              <h1 className="text-3xl font-bold">Quality Management System</h1>
            </div>
            <p className="text-text-muted">CAPA Tracking • Audit Trail • Management of Change</p>
          </div>
          <button className="flex items-center space-x-2 bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue px-4 py-2 rounded-lg transition-colors border border-accent-blue/30">
            <PlusCircle className="w-4 h-4" />
            <span>Create CAPA</span>
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-accent-amber">
            <div className="p-3 bg-accent-amber/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-accent-amber" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Open CAPAs</p>
              <h2 className="text-2xl font-bold">{stats.openCapas}</h2>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-accent-blue">
            <div className="p-3 bg-accent-blue/10 rounded-full">
              <Activity className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Active MOCs</p>
              <h2 className="text-2xl font-bold">{stats.activeMocs}</h2>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-accent-emerald">
            <div className="p-3 bg-accent-emerald/10 rounded-full">
              <FileText className="w-6 h-6 text-accent-emerald" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Audit Events (30d)</p>
              <h2 className="text-2xl font-bold">{stats.auditEvents}</h2>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - CAPAs and MOCs */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-accent-rose" />
                Corrective & Preventive Actions (CAPA)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-text-muted">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Severity</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Equipment</th>
                      <th className="pb-3 font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {capas.map((capa, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-medium">{capa.id}</td>
                        <td className="py-3 text-text-secondary pr-4">{capa.title}</td>
                        <td className="py-3"><Badge color={getSeverityColor(capa.severity)}>{capa.severity}</Badge></td>
                        <td className="py-3"><Badge color={getStatusColor(capa.status)}>{capa.status.replace('_', ' ')}</Badge></td>
                        <td className="py-3 text-text-secondary">{capa.equipment}</td>
                        <td className="py-3 text-text-muted">{capa.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-accent-blue" />
                Management of Change (MOC)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mocs.map((moc, idx) => (
                  <div key={idx} className="bg-bg-secondary p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-text-muted">{moc.id}</span>
                      <Badge color={moc.status === "Implemented" ? "emerald" : moc.status === "Approved" ? "blue" : "amber"}>
                        {moc.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-4 line-clamp-2">{moc.title}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-muted">Risk:</span>
                      <Badge color={moc.risk === "High" ? "rose" : moc.risk === "Medium" ? "amber" : "emerald"}>{moc.risk}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column - Audit Trail */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-accent-emerald" />
                System Audit Trail
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {auditTrail.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-bg-secondary text-text-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckCircle className="w-4 h-4 text-accent-emerald" />
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-card border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-text-primary text-sm">{item.id}</span>
                        <span className="text-xs text-text-muted">{item.time}</span>
                      </div>
                      <div className="text-text-secondary text-sm">{item.event}</div>
                      <div className="text-xs text-text-muted mt-2">User: {item.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
