// ============================================================
// IntelliPlant — Comprehensive Demo/Fallback Data
// ============================================================

export const PLANT_INFO = {
  name: 'Vizag Coastal Refinery',
  location: 'Visakhapatnam, Andhra Pradesh',
  capacity: '15 MMTPA',
  established: '2017',
};

// ─── Dashboard Metrics ───────────────────────────────────────
export const dashboardMetrics = {
  documentsIngested: { value: 1247, trend: +12.5, label: 'Documents Ingested' },
  knowledgeEntities: { value: 8432, trend: +8.3, label: 'Knowledge Entities' },
  activeEquipment: { value: 342, trend: -2.1, label: 'Active Equipment' },
  complianceScore: { value: 87, trend: +3.2, label: 'Compliance Score' },
};

export const recentActivity = [
  { id: 1, type: 'upload', title: 'P&ID Drawing — CDU Unit uploaded', user: 'Rajesh Kumar', time: '5 min ago', icon: 'FileUp' },
  { id: 2, type: 'alert', title: 'Pump P-101A vibration anomaly detected', user: 'System', time: '18 min ago', icon: 'AlertTriangle' },
  { id: 3, type: 'compliance', title: 'OISD-117 quarterly review completed', user: 'Priya Sharma', time: '1 hour ago', icon: 'ShieldCheck' },
  { id: 4, type: 'maintenance', title: 'Heat Exchanger E-205 inspection scheduled', user: 'Vikram Singh', time: '2 hours ago', icon: 'Wrench' },
  { id: 5, type: 'query', title: 'Copilot query: "Max operating pressure for V-301"', user: 'Anand Patel', time: '3 hours ago', icon: 'MessageSquare' },
  { id: 6, type: 'entity', title: '47 new entities extracted from SOP batch', user: 'System', time: '4 hours ago', icon: 'Sparkles' },
];

// ─── Documents ───────────────────────────────────────────────
export const documents = [
  {
    id: 'doc-001',
    title: 'CDU Unit P&ID Drawing Rev.12',
    type: 'pdf',
    size: '4.2 MB',
    uploadedBy: 'Rajesh Kumar',
    uploadDate: '2026-06-23',
    status: 'processed',
    entityCount: 127,
    pages: 24,
    tags: ['P&ID', 'CDU', 'Engineering Drawing'],
    description: 'Process and Instrumentation Diagram for the Crude Distillation Unit, Revision 12. Includes all valve positions, instrumentation loops, and safety interlocks.',
  },
  {
    id: 'doc-002',
    title: 'OISD-117 Compliance Checklist 2026',
    type: 'spreadsheet',
    size: '1.8 MB',
    uploadedBy: 'Priya Sharma',
    uploadDate: '2026-06-22',
    status: 'processed',
    entityCount: 89,
    pages: 12,
    tags: ['OISD-117', 'Compliance', 'Safety'],
    description: 'Annual compliance checklist against OISD Standard 117 for fire protection facilities in petroleum refineries.',
  },
  {
    id: 'doc-003',
    title: 'Pump P-101A Maintenance History',
    type: 'pdf',
    size: '2.1 MB',
    uploadedBy: 'Vikram Singh',
    uploadDate: '2026-06-21',
    status: 'processed',
    entityCount: 64,
    pages: 18,
    tags: ['Pump', 'Maintenance', 'P-101A'],
    description: 'Complete maintenance history log for centrifugal pump P-101A including all corrective and preventive maintenance records from 2019 to 2026.',
  },
  {
    id: 'doc-004',
    title: 'Emergency Response Procedure — H2S Leak',
    type: 'pdf',
    size: '890 KB',
    uploadedBy: 'Suresh Reddy',
    uploadDate: '2026-06-20',
    status: 'processed',
    entityCount: 43,
    pages: 8,
    tags: ['Emergency', 'H2S', 'Safety', 'SOP'],
    description: 'Standard Operating Procedure for emergency response during hydrogen sulfide leak scenarios in the hydrocracker unit.',
  },
  {
    id: 'doc-005',
    title: 'Vibration Analysis Report — Compressor C-301',
    type: 'pdf',
    size: '5.6 MB',
    uploadedBy: 'Meera Nair',
    uploadDate: '2026-06-19',
    status: 'processing',
    entityCount: 31,
    pages: 32,
    tags: ['Vibration', 'Compressor', 'Analysis'],
    description: 'Detailed vibration analysis report with FFT spectra, trend analysis, and bearing condition assessment for reciprocating compressor C-301.',
  },
  {
    id: 'doc-006',
    title: 'IS:2825 Pressure Vessel Design Calculations',
    type: 'spreadsheet',
    size: '3.4 MB',
    uploadedBy: 'Arjun Desai',
    uploadDate: '2026-06-18',
    status: 'processed',
    entityCount: 156,
    pages: 45,
    tags: ['IS:2825', 'Pressure Vessel', 'Design'],
    description: 'Design calculations for pressure vessels as per Indian Standard IS:2825, including shell thickness, nozzle reinforcement, and hydrostatic test pressures.',
  },
];

// ─── Knowledge Graph ─────────────────────────────────────────
export const graphNodes = [
  // Equipment nodes
  { id: 'eq-1', label: 'Pump P-101A', type: 'equipment', group: 1, details: { manufacturer: 'KSB', status: 'Running', rpm: 2950 } },
  { id: 'eq-2', label: 'Pump P-101B', type: 'equipment', group: 1, details: { manufacturer: 'KSB', status: 'Standby', rpm: 2950 } },
  { id: 'eq-3', label: 'Compressor C-301', type: 'equipment', group: 1, details: { manufacturer: 'Atlas Copco', status: 'Running', rpm: 1480 } },
  { id: 'eq-4', label: 'Heat Exchanger E-205', type: 'equipment', group: 1, details: { manufacturer: 'BHEL', status: 'Running', type: 'Shell & Tube' } },
  { id: 'eq-5', label: 'Reactor R-101', type: 'equipment', group: 1, details: { manufacturer: 'L&T', status: 'Running', pressure: '45 bar' } },
  { id: 'eq-6', label: 'Column T-201', type: 'equipment', group: 1, details: { manufacturer: 'Godrej', status: 'Running', trays: 42 } },
  { id: 'eq-7', label: 'Vessel V-301', type: 'equipment', group: 1, details: { manufacturer: 'L&T', status: 'Running', capacity: '50 m³' } },
  { id: 'eq-8', label: 'Furnace H-101', type: 'equipment', group: 1, details: { manufacturer: 'Thermax', status: 'Running', duty: '25 MW' } },
  { id: 'eq-9', label: 'Tank TK-501', type: 'equipment', group: 1, details: { manufacturer: 'Local', status: 'In Service', capacity: '10000 m³' } },
  { id: 'eq-10', label: 'Valve XV-1001', type: 'equipment', group: 1, details: { manufacturer: 'Fisher', status: 'Open', type: 'Control Valve' } },

  // Document nodes
  { id: 'doc-1', label: 'CDU P&ID Rev.12', type: 'document', group: 2 },
  { id: 'doc-2', label: 'OISD-117 Checklist', type: 'document', group: 2 },
  { id: 'doc-3', label: 'P-101A Maint. Log', type: 'document', group: 2 },
  { id: 'doc-4', label: 'H2S Emergency SOP', type: 'document', group: 2 },
  { id: 'doc-5', label: 'C-301 Vibration Report', type: 'document', group: 2 },
  { id: 'doc-6', label: 'IS:2825 Calculations', type: 'document', group: 2 },

  // Person nodes
  { id: 'per-1', label: 'Rajesh Kumar', type: 'person', group: 3, details: { role: 'Senior Engineer', dept: 'Process' } },
  { id: 'per-2', label: 'Priya Sharma', type: 'person', group: 3, details: { role: 'Safety Officer', dept: 'HSE' } },
  { id: 'per-3', label: 'Vikram Singh', type: 'person', group: 3, details: { role: 'Maintenance Lead', dept: 'Mechanical' } },
  { id: 'per-4', label: 'Meera Nair', type: 'person', group: 3, details: { role: 'Reliability Engineer', dept: 'Reliability' } },

  // Procedure nodes
  { id: 'proc-1', label: 'Pump Startup SOP', type: 'procedure', group: 4 },
  { id: 'proc-2', label: 'Emergency Shutdown', type: 'procedure', group: 4 },
  { id: 'proc-3', label: 'Hot Work Permit', type: 'procedure', group: 4 },
  { id: 'proc-4', label: 'Confined Space Entry', type: 'procedure', group: 4 },

  // Chemical nodes
  { id: 'chem-1', label: 'Crude Oil', type: 'chemical', group: 5, details: { hazard: 'Flammable', api: '28-35' } },
  { id: 'chem-2', label: 'Hydrogen Sulfide', type: 'chemical', group: 5, details: { hazard: 'Toxic', idlh: '50 ppm' } },
  { id: 'chem-3', label: 'Naphtha', type: 'chemical', group: 5, details: { hazard: 'Flammable', flashPoint: '-2°C' } },
  { id: 'chem-4', label: 'Caustic Soda', type: 'chemical', group: 5, details: { hazard: 'Corrosive', concentration: '10%' } },

  // Regulation nodes
  { id: 'reg-1', label: 'OISD-117', type: 'regulation', group: 6, details: { title: 'Fire Protection', year: 2020 } },
  { id: 'reg-2', label: 'OISD-144', type: 'regulation', group: 6, details: { title: 'Hydrocarbon Pipeline Safety', year: 2019 } },
  { id: 'reg-3', label: 'IS:2825', type: 'regulation', group: 6, details: { title: 'Pressure Vessel Code', year: 2018 } },
  { id: 'reg-4', label: 'Factory Act 1948', type: 'regulation', group: 6, details: { title: 'Industrial Safety', year: 1948 } },

  // Failure Mode nodes
  { id: 'fail-1', label: 'Bearing Failure', type: 'failureMode', group: 7 },
  { id: 'fail-2', label: 'Seal Leak', type: 'failureMode', group: 7 },
  { id: 'fail-3', label: 'Vibration Excess', type: 'failureMode', group: 7 },
  { id: 'fail-4', label: 'Corrosion', type: 'failureMode', group: 7 },
  { id: 'fail-5', label: 'Overheating', type: 'failureMode', group: 7 },
];

export const graphEdges = [
  // Equipment ↔ Documents
  { source: 'eq-1', target: 'doc-1', label: 'shown in' },
  { source: 'eq-1', target: 'doc-3', label: 'documented in' },
  { source: 'eq-2', target: 'doc-1', label: 'shown in' },
  { source: 'eq-3', target: 'doc-5', label: 'analyzed in' },
  { source: 'eq-4', target: 'doc-1', label: 'shown in' },
  { source: 'eq-5', target: 'doc-1', label: 'shown in' },
  { source: 'eq-6', target: 'doc-1', label: 'shown in' },
  { source: 'eq-7', target: 'doc-6', label: 'designed per' },
  { source: 'eq-8', target: 'doc-1', label: 'shown in' },
  { source: 'eq-9', target: 'doc-2', label: 'audited in' },
  { source: 'eq-10', target: 'doc-1', label: 'shown in' },

  // Equipment ↔ Failure Modes
  { source: 'eq-1', target: 'fail-1', label: 'susceptible to' },
  { source: 'eq-1', target: 'fail-2', label: 'susceptible to' },
  { source: 'eq-1', target: 'fail-3', label: 'susceptible to' },
  { source: 'eq-3', target: 'fail-3', label: 'susceptible to' },
  { source: 'eq-3', target: 'fail-1', label: 'susceptible to' },
  { source: 'eq-4', target: 'fail-4', label: 'susceptible to' },
  { source: 'eq-4', target: 'fail-5', label: 'susceptible to' },
  { source: 'eq-5', target: 'fail-4', label: 'susceptible to' },
  { source: 'eq-8', target: 'fail-5', label: 'susceptible to' },

  // Equipment ↔ Chemicals
  { source: 'eq-1', target: 'chem-1', label: 'pumps' },
  { source: 'eq-5', target: 'chem-2', label: 'processes' },
  { source: 'eq-6', target: 'chem-3', label: 'separates' },
  { source: 'eq-6', target: 'chem-1', label: 'distills' },
  { source: 'eq-9', target: 'chem-1', label: 'stores' },
  { source: 'eq-7', target: 'chem-4', label: 'contains' },

  // Equipment ↔ Procedures
  { source: 'eq-1', target: 'proc-1', label: 'follows' },
  { source: 'eq-2', target: 'proc-1', label: 'follows' },
  { source: 'eq-5', target: 'proc-2', label: 'has' },
  { source: 'eq-8', target: 'proc-3', label: 'requires' },
  { source: 'eq-7', target: 'proc-4', label: 'requires' },

  // Equipment ↔ Regulations
  { source: 'eq-7', target: 'reg-3', label: 'governed by' },
  { source: 'eq-9', target: 'reg-1', label: 'governed by' },
  { source: 'eq-9', target: 'reg-2', label: 'governed by' },

  // Documents ↔ Regulations
  { source: 'doc-2', target: 'reg-1', label: 'checklist for' },
  { source: 'doc-6', target: 'reg-3', label: 'per standard' },
  { source: 'doc-4', target: 'reg-4', label: 'compliant with' },

  // Persons ↔ Documents
  { source: 'per-1', target: 'doc-1', label: 'authored' },
  { source: 'per-2', target: 'doc-2', label: 'reviewed' },
  { source: 'per-3', target: 'doc-3', label: 'authored' },
  { source: 'per-4', target: 'doc-5', label: 'authored' },

  // Persons ↔ Equipment
  { source: 'per-3', target: 'eq-1', label: 'maintains' },
  { source: 'per-3', target: 'eq-3', label: 'maintains' },
  { source: 'per-4', target: 'eq-3', label: 'monitors' },

  // Chemicals ↔ Regulations
  { source: 'chem-2', target: 'reg-4', label: 'regulated by' },

  // Chemicals ↔ Failure Modes
  { source: 'chem-2', target: 'fail-4', label: 'causes' },
  { source: 'chem-4', target: 'fail-4', label: 'causes' },

  // Procedures ↔ Documents
  { source: 'proc-2', target: 'doc-4', label: 'documented in' },

  // Procedures ↔ Regulations
  { source: 'proc-3', target: 'reg-4', label: 'required by' },
  { source: 'proc-4', target: 'reg-4', label: 'required by' },

  // Cross links
  { source: 'eq-1', target: 'eq-2', label: 'spare for' },
  { source: 'eq-5', target: 'eq-6', label: 'feeds' },
  { source: 'eq-8', target: 'eq-6', label: 'heats' },
  { source: 'fail-3', target: 'fail-1', label: 'leads to' },
];

// ─── Equipment / Maintenance ─────────────────────────────────
export const equipmentList = [
  {
    id: 'eq-001', tag: 'P-101A', name: 'Crude Oil Feed Pump A', type: 'Centrifugal Pump',
    unit: 'CDU', healthScore: 72, status: 'warning',
    lastMaintenance: '2026-05-15', nextMaintenance: '2026-07-15',
    mtbf: 180, totalDowntime: 48, maintenanceCost: 245000,
    failureHistory: [
      { mode: 'Bearing Failure', count: 3 },
      { mode: 'Seal Leak', count: 5 },
      { mode: 'Vibration', count: 8 },
      { mode: 'Cavitation', count: 2 },
    ],
    maintenanceHistory: [
      { date: '2026-05-15', type: 'Preventive', description: 'Bearing replacement & alignment', cost: 45000, duration: '8 hrs' },
      { date: '2026-03-02', type: 'Corrective', description: 'Mechanical seal replacement due to leak', cost: 65000, duration: '12 hrs' },
      { date: '2025-12-10', type: 'Preventive', description: 'Routine vibration check & oil change', cost: 15000, duration: '4 hrs' },
      { date: '2025-09-22', type: 'Corrective', description: 'Impeller wear — replaced impeller', cost: 120000, duration: '24 hrs' },
    ],
    rcaAnalysis: 'Root cause analysis reveals recurring seal failures linked to thermal cycling during startup. Recommended: Install thermal sleeve and modify startup procedure to include gradual warm-up phase. Estimated cost savings: ₹3.2L/year.',
  },
  {
    id: 'eq-002', tag: 'P-101B', name: 'Crude Oil Feed Pump B (Standby)', type: 'Centrifugal Pump',
    unit: 'CDU', healthScore: 95, status: 'healthy',
    lastMaintenance: '2026-06-01', nextMaintenance: '2026-09-01',
    mtbf: 365, totalDowntime: 12, maintenanceCost: 85000,
    failureHistory: [
      { mode: 'Bearing Failure', count: 1 },
      { mode: 'Seal Leak', count: 1 },
    ],
    maintenanceHistory: [
      { date: '2026-06-01', type: 'Preventive', description: 'Annual overhaul — bearings, seals, coupling', cost: 85000, duration: '16 hrs' },
    ],
  },
  {
    id: 'eq-003', tag: 'C-301', name: 'Hydrogen Recycle Compressor', type: 'Reciprocating Compressor',
    unit: 'HCU', healthScore: 58, status: 'critical',
    lastMaintenance: '2026-04-20', nextMaintenance: '2026-06-25',
    mtbf: 120, totalDowntime: 96, maintenanceCost: 780000,
    failureHistory: [
      { mode: 'Valve Failure', count: 6 },
      { mode: 'Vibration', count: 4 },
      { mode: 'Piston Ring Wear', count: 3 },
      { mode: 'Packing Leak', count: 5 },
    ],
    maintenanceHistory: [
      { date: '2026-04-20', type: 'Corrective', description: 'Suction valve replacement — Stage 2', cost: 180000, duration: '36 hrs' },
      { date: '2026-02-11', type: 'Corrective', description: 'Piston ring replacement — all stages', cost: 320000, duration: '48 hrs' },
      { date: '2025-11-05', type: 'Preventive', description: 'Annual overhaul', cost: 280000, duration: '72 hrs' },
    ],
    rcaAnalysis: 'Recurring valve failures in Stage 2 attributed to high gas temperature exceeding design limits. Inter-stage cooler performance degraded. Immediate action: Clean inter-stage cooler. Long-term: Replace with higher-capacity cooler design.',
  },
  {
    id: 'eq-004', tag: 'E-205', name: 'Crude Pre-Heat Exchanger', type: 'Shell & Tube HX',
    unit: 'CDU', healthScore: 84, status: 'healthy',
    lastMaintenance: '2026-05-28', nextMaintenance: '2026-08-28',
    mtbf: 270, totalDowntime: 24, maintenanceCost: 195000,
    failureHistory: [
      { mode: 'Tube Leak', count: 2 },
      { mode: 'Fouling', count: 4 },
    ],
    maintenanceHistory: [
      { date: '2026-05-28', type: 'Preventive', description: 'Chemical cleaning & tube plugging', cost: 95000, duration: '24 hrs' },
      { date: '2025-12-15', type: 'Corrective', description: 'Tube bundle leak repair', cost: 100000, duration: '16 hrs' },
    ],
  },
  {
    id: 'eq-005', tag: 'R-101', name: 'Hydrocracker Reactor', type: 'Fixed Bed Reactor',
    unit: 'HCU', healthScore: 91, status: 'healthy',
    lastMaintenance: '2026-01-15', nextMaintenance: '2027-01-15',
    mtbf: 730, totalDowntime: 168, maintenanceCost: 4500000,
    failureHistory: [
      { mode: 'Catalyst Deactivation', count: 1 },
    ],
    maintenanceHistory: [
      { date: '2026-01-15', type: 'Preventive', description: 'Catalyst replacement & reactor internals inspection', cost: 4500000, duration: '168 hrs' },
    ],
  },
  {
    id: 'eq-006', tag: 'T-201', name: 'Atmospheric Distillation Column', type: 'Distillation Column',
    unit: 'CDU', healthScore: 88, status: 'healthy',
    lastMaintenance: '2026-03-01', nextMaintenance: '2027-03-01',
    mtbf: 545, totalDowntime: 120, maintenanceCost: 2800000,
    failureHistory: [
      { mode: 'Tray Damage', count: 1 },
      { mode: 'Corrosion', count: 2 },
    ],
    maintenanceHistory: [
      { date: '2026-03-01', type: 'Preventive', description: 'Turnaround — tray inspection & naphtha draw repair', cost: 2800000, duration: '120 hrs' },
    ],
  },
  {
    id: 'eq-007', tag: 'V-301', name: 'High Pressure Separator', type: 'Pressure Vessel',
    unit: 'HCU', healthScore: 79, status: 'warning',
    lastMaintenance: '2026-04-10', nextMaintenance: '2026-07-10',
    mtbf: 200, totalDowntime: 36, maintenanceCost: 320000,
    failureHistory: [
      { mode: 'Corrosion', count: 3 },
      { mode: 'Level Control Issue', count: 2 },
    ],
    maintenanceHistory: [
      { date: '2026-04-10', type: 'Preventive', description: 'Internal inspection & thickness survey', cost: 120000, duration: '24 hrs' },
      { date: '2025-10-05', type: 'Corrective', description: 'Weld overlay on corroded area', cost: 200000, duration: '12 hrs' },
    ],
  },
  {
    id: 'eq-008', tag: 'H-101', name: 'Crude Heater', type: 'Fired Heater',
    unit: 'CDU', healthScore: 76, status: 'warning',
    lastMaintenance: '2026-05-01', nextMaintenance: '2026-08-01',
    mtbf: 240, totalDowntime: 48, maintenanceCost: 520000,
    failureHistory: [
      { mode: 'Tube Overheating', count: 2 },
      { mode: 'Burner Malfunction', count: 3 },
      { mode: 'Refractory Damage', count: 1 },
    ],
    maintenanceHistory: [
      { date: '2026-05-01', type: 'Preventive', description: 'Burner tip cleaning & flame pattern adjustment', cost: 120000, duration: '16 hrs' },
      { date: '2026-02-18', type: 'Corrective', description: 'Tube skin thermocouple replacement', cost: 80000, duration: '8 hrs' },
      { date: '2025-11-20', type: 'Corrective', description: 'Refractory repair — radiation section', cost: 320000, duration: '24 hrs' },
    ],
  },
  {
    id: 'eq-009', tag: 'TK-501', name: 'Crude Oil Storage Tank', type: 'Floating Roof Tank',
    unit: 'Tank Farm', healthScore: 82, status: 'healthy',
    lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10',
    mtbf: 365, totalDowntime: 72, maintenanceCost: 650000,
    failureHistory: [
      { mode: 'Seal Deterioration', count: 2 },
      { mode: 'Corrosion', count: 1 },
    ],
    maintenanceHistory: [
      { date: '2026-02-10', type: 'Preventive', description: 'Floating roof seal replacement', cost: 450000, duration: '48 hrs' },
      { date: '2025-08-15', type: 'Preventive', description: 'Tank bottom plate thickness survey', cost: 200000, duration: '24 hrs' },
    ],
  },
  {
    id: 'eq-010', tag: 'XV-1001', name: 'CDU Feed Control Valve', type: 'Control Valve',
    unit: 'CDU', healthScore: 93, status: 'healthy',
    lastMaintenance: '2026-06-10', nextMaintenance: '2026-12-10',
    mtbf: 400, totalDowntime: 8, maintenanceCost: 95000,
    failureHistory: [
      { mode: 'Packing Leak', count: 1 },
      { mode: 'Positioner Failure', count: 1 },
    ],
    maintenanceHistory: [
      { date: '2026-06-10', type: 'Preventive', description: 'Valve trim inspection & positioner calibration', cost: 95000, duration: '8 hrs' },
    ],
  },
];

// ─── Compliance ──────────────────────────────────────────────
export const complianceData = {
  overallScore: 87,
  regulations: [
    {
      id: 'oisd-117', name: 'OISD-117', fullName: 'Fire Protection Facilities for Petroleum Refineries',
      score: 92, lastAudit: '2026-05-15', nextAudit: '2026-08-15',
      gapCount: 3, totalChecks: 48, passedChecks: 44,
      gaps: [
        { severity: 'Major', description: 'Foam system in Tank Farm B not tested in last 6 months', equipment: 'TK-501 to TK-510', action: 'Schedule foam system testing within 2 weeks' },
        { severity: 'Minor', description: 'Fire water network pressure below 7 kg/cm² at dead-end', equipment: 'Unit 300 Ring Main', action: 'Install jockey pump at dead-end section' },
        { severity: 'Minor', description: 'Two fire extinguishers expired in Compressor House', equipment: 'Compressor House C-300', action: 'Replace expired extinguishers immediately' },
      ],
    },
    {
      id: 'oisd-144', name: 'OISD-144', fullName: 'Petroleum Oil & Gas Pipeline Transportation Systems',
      score: 88, lastAudit: '2026-04-20', nextAudit: '2026-10-20',
      gapCount: 4, totalChecks: 36, passedChecks: 32,
      gaps: [
        { severity: 'Critical', description: 'CP (Cathodic Protection) reading below -0.85V on 3 pipeline sections', equipment: 'Pipeline PL-101, PL-103, PL-107', action: 'Inspect CP system rectifier and anode bed within 1 week' },
        { severity: 'Major', description: 'Pipeline patrol frequency not meeting quarterly requirement', equipment: 'Cross-country pipeline', action: 'Increase patrol frequency, assign dedicated patrol team' },
        { severity: 'Minor', description: 'Warning signage missing at 2 pipeline crossings', equipment: 'Road crossing RC-05, RC-08', action: 'Install warning signs within 1 month' },
        { severity: 'Minor', description: 'Pipeline marker posts damaged at 5 locations', equipment: 'Various locations', action: 'Replace damaged marker posts' },
      ],
    },
    {
      id: 'factory-act', name: 'Factory Act 1948', fullName: 'The Factories Act, 1948 — Industrial Safety Provisions',
      score: 85, lastAudit: '2026-03-10', nextAudit: '2026-09-10',
      gapCount: 5, totalChecks: 52, passedChecks: 44,
      gaps: [
        { severity: 'Major', description: 'Noise level exceeding 85 dB in 3 areas without ear protection signage', equipment: 'Compressor House, Pump House A, Generator Room', action: 'Install noise warning signage and provide ear muffs at entry' },
        { severity: 'Major', description: 'Annual stability certificate for chimney stack pending', equipment: 'Furnace Stack FS-01', action: 'Engage structural consultant for stability assessment' },
        { severity: 'Minor', description: 'First aid box contents incomplete in Unit 200', equipment: 'HCU Control Room', action: 'Replenish first aid box as per checklist' },
        { severity: 'Minor', description: 'Safety committee meeting minutes not documented for Q1', equipment: 'N/A', action: 'Document retrospective minutes and improve process' },
        { severity: 'Minor', description: 'Overtime records not maintained as prescribed format', equipment: 'N/A', action: 'Update record format and train supervisors' },
      ],
    },
    {
      id: 'peso', name: 'PESO', fullName: 'Petroleum & Explosives Safety Organisation Regulations',
      score: 90, lastAudit: '2026-06-01', nextAudit: '2026-12-01',
      gapCount: 2, totalChecks: 28, passedChecks: 25,
      gaps: [
        { severity: 'Major', description: 'Static earthing certificate renewal overdue for 5 tanks', equipment: 'TK-501 to TK-505', action: 'Arrange third-party static earthing testing' },
        { severity: 'Minor', description: 'License renewal application for LPG storage pending', equipment: 'LPG Sphere S-01', action: 'Submit renewal application to PESO regional office' },
      ],
    },
    {
      id: 'is-2825', name: 'IS:2825', fullName: 'Indian Standard — Code for Unfired Pressure Vessels',
      score: 82, lastAudit: '2026-04-05', nextAudit: '2026-10-05',
      gapCount: 4, totalChecks: 32, passedChecks: 26,
      gaps: [
        { severity: 'Critical', description: 'Hydrostatic test overdue for 2 pressure vessels', equipment: 'V-301, V-305', action: 'Schedule hydrostatic test during next planned shutdown' },
        { severity: 'Major', description: 'Thickness survey data shows 3 vessels below minimum required thickness', equipment: 'V-301, V-310, V-312', action: 'Perform detailed fitness-for-service assessment' },
        { severity: 'Major', description: 'Safety valve set pressure not verified for 4 vessels after last turnaround', equipment: 'V-301, V-302, V-305, V-310', action: 'Calibrate safety valves on priority basis' },
        { severity: 'Minor', description: 'Vessel data plates illegible on 3 vessels', equipment: 'V-310, V-312, V-315', action: 'Replace data plates with updated information' },
      ],
    },
  ],
};

// ─── Chat / Copilot ──────────────────────────────────────────
export const chatConversations = [
  { id: 'conv-1', title: 'Pump P-101A operating limits', time: '2 hours ago', messageCount: 4 },
  { id: 'conv-2', title: 'OISD-117 compliance gaps', time: '1 day ago', messageCount: 6 },
  { id: 'conv-3', title: 'H2S emergency procedures', time: '2 days ago', messageCount: 3 },
  { id: 'conv-4', title: 'Heat exchanger fouling analysis', time: '3 days ago', messageCount: 8 },
];

export const suggestedQuestions = [
  'Perform complete analysis on Pump P-101A (RCA, Compliance, Lessons)',
  'What is the maximum operating pressure for Vessel V-301?',
  'Show me the maintenance history for Pump P-101A',
  'What are the OISD-117 compliance gaps?',
  'Explain the emergency shutdown procedure for the hydrocracker',
  'Generate a root cause analysis for compressor C-301 failures',
];

export const demoChatMessages = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What is the maximum operating pressure for Vessel V-301?',
    timestamp: '10:30 AM',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Based on the design calculations documented in **IS:2825 Pressure Vessel Design Calculations**, the maximum operating pressure for **Vessel V-301 (High Pressure Separator)** is:

## Operating Parameters

| Parameter | Value |
|-----------|-------|
| **Design Pressure** | 52 kg/cm² |
| **Maximum Allowable Working Pressure (MAWP)** | 48 kg/cm² |
| **Normal Operating Pressure** | 45 kg/cm² |
| **Design Temperature** | 450°C |
| **Hydrostatic Test Pressure** | 78 kg/cm² |

## Key Safety Notes

1. The vessel must **never** exceed the MAWP of **48 kg/cm²** during normal operations
2. The safety valve is set at **50 kg/cm²** (design pressure minus accumulation allowance)
3. The corrosion allowance is **3mm**, and the latest thickness survey (April 2026) shows wall thickness is within acceptable limits but trending downward

⚠️ **Important**: The fitness-for-service assessment recommended in the IS:2825 compliance review should be completed before the next operating cycle, as 3 vessels including V-301 show thickness readings approaching the minimum required threshold.`,
    timestamp: '10:30 AM',
    citations: [
      {
        id: 'cite-1',
        document: 'IS:2825 Pressure Vessel Design Calculations',
        excerpt: 'V-301 High Pressure Separator: Design pressure 52 kg/cm², MAWP 48 kg/cm², shell material SA-387 Gr.22 Cl.2, corrosion allowance 3mm...',
        page: 12,
        confidence: 0.96,
      },
      {
        id: 'cite-2',
        document: 'CDU Unit P&ID Drawing Rev.12',
        excerpt: 'V-301 operating conditions: P = 45 bar, T = 420°C, with PSV set at 50 bar...',
        page: 8,
        confidence: 0.91,
      },
      {
        id: 'cite-3',
        document: 'OISD-117 Compliance Checklist 2026',
        excerpt: 'Hydrostatic test overdue for V-301 — last test conducted March 2024, due March 2026...',
        page: 3,
        confidence: 0.84,
      },
    ],
  },
];

// ─── System Health ───────────────────────────────────────────
export const systemHealth = [
  { label: 'Document Pipeline', status: 'operational', uptime: '99.9%' },
  { label: 'Knowledge Engine', status: 'operational', uptime: '99.7%' },
  { label: 'Graph Database', status: 'operational', uptime: '99.8%' },
  { label: 'AI Copilot', status: 'degraded', uptime: '97.2%' },
];

// ─── Node Type Config ────────────────────────────────────────
export const nodeTypeConfig = {
  equipment:   { color: '#3b82f6', label: 'Equipment',    icon: '⚙️' },
  document:    { color: '#10b981', label: 'Document',     icon: '📄' },
  person:      { color: '#f59e0b', label: 'Person',       icon: '👤' },
  procedure:   { color: '#8b5cf6', label: 'Procedure',    icon: '📋' },
  chemical:    { color: '#06b6d4', label: 'Chemical',     icon: '🧪' },
  regulation:  { color: '#f59e0b', label: 'Regulation',   icon: '🛡️' },
  failureMode: { color: '#f43f5e', label: 'Failure Mode', icon: '⚠️' },
};
