import os
import csv
from datetime import datetime, timedelta
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

# Create data directory if it doesn't exist
BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DIR = BASE_DIR / "data" / "sample_documents"
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)

# Define styles
styles = getSampleStyleSheet()
title_style = styles['Title']
h1_style = styles['Heading1']
h2_style = styles['Heading2']
normal_style = styles['Normal']

def add_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica-Bold', 12)
    canvas.drawString(50, 800, "Bharat Petrochem Limited (BPL)")
    canvas.setFont('Helvetica', 10)
    canvas.drawString(50, 785, "Vizag Coastal Refinery, Visakhapatnam, India - Capacity: 15 MMTPA")
    canvas.line(50, 775, 550, 775)
    
    # Footer
    canvas.line(50, 50, 550, 50)
    canvas.setFont('Helvetica', 9)
    canvas.drawString(50, 35, f"Generated: {datetime.now().strftime('%Y-%m-%d')} | Confidential Industrial Data")
    canvas.drawRightString(550, 35, f"Page {doc.page}")
    canvas.restoreState()

def create_equipment_maintenance_log():
    filename = SAMPLE_DIR / "BPL-MAINT-2024-0147.pdf"
    doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=100)
    story = []
    
    story.append(Paragraph("Equipment Maintenance Log", title_style))
    story.append(Paragraph("Document No: BPL-MAINT-2024-0147", h2_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Equipment Information", h1_style))
    data = [
        ["Tag No.", "P-101A", "Equipment", "Centrifugal Pump"],
        ["Model", "KSB Mega CPK 200-330", "Standard", "API 610 Type OH2"],
        ["Service", "Crude Charge Pump", "Location", "Crude Distillation Unit (CDU)"],
    ]
    t = Table(data, colWidths=[100, 150, 100, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
    ]))
    story.append(t)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Maintenance History (12 Months)", h1_style))
    history_data = [
        ["Date", "Type", "Vibration (mm/s)", "Bearing Temp (°C)", "Findings & Actions", "Technician"],
        ["2024-01-15", "PM", "2.1", "65", "Routine check. Lubed bearings.", "R. Sharma"],
        ["2024-04-12", "PM", "2.8", "68", "Vibration slightly high. Monitored.", "A. Patel"],
        ["2024-07-20", "CM", "6.5", "85", "High vibration alert. Replaced impeller.", "K. Singh"],
        ["2024-07-22", "Test", "1.5", "62", "Post-repair run test successful.", "M. Reddy"],
        ["2024-10-10", "PM", "1.8", "63", "Seal inspection OK. No leaks.", "R. Sharma"]
    ]
    ht = Table(history_data, colWidths=[60, 40, 70, 70, 180, 80])
    ht.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d9edf7')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('WORDWRAP', (0, 0), (-1, -1), True)
    ]))
    story.append(ht)
    
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"Created {filename}")

def create_safety_inspection_report():
    filename = SAMPLE_DIR / "BPL-INSP-2024-0089.pdf"
    doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=100)
    story = []
    
    story.append(Paragraph("Annual Safety Inspection Report", title_style))
    story.append(Paragraph("Document No: BPL-INSP-2024-0089 | Standard: OISD-STD-117", h2_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Overview", h1_style))
    story.append(Paragraph("This document details the annual OISD-STD-117 compliance audit of the Crude Distillation Unit (CDU) fire protection systems.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Checklist & Findings", h1_style))
    checks = [
        ["Check Item", "Regulation", "Status", "Remarks"],
        ["Fire Water Pump Capacity Test", "OISD-117 4.2", "Compliant", "Pump delivered 100% capacity at 10.5 kg/cm2."],
        ["Foam System Proportioning Test", "OISD-117 4.5", "Partial", "Foam concentration was 2.5% (target 3%). Re-calibration needed."],
        ["Deluge Valve Actuation", "OISD-117 4.7", "Compliant", "Response time < 10 seconds."],
        ["Hydrant Flow Test", "OISD-117 4.8", "Non-Compliant", "Hydrant H-204 pressure drop excessive. Line blockage suspected."],
    ]
    t = Table(checks, colWidths=[140, 80, 80, 200])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d9edf7')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TEXTCOLOR', (2, 2), (2, 2), colors.orange), # Partial
        ('TEXTCOLOR', (2, 4), (2, 4), colors.red), # Non-compliant
    ]))
    story.append(t)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Corrective Actions", h1_style))
    story.append(Paragraph("1. Re-calibrate foam proportioner on tank T-105 by 2024-11-15.", normal_style))
    story.append(Paragraph("2. Flush underground fire water header leading to H-204 and retest by 2024-11-20.", normal_style))
    
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"Created {filename}")

def create_sop():
    filename = SAMPLE_DIR / "BPL-SOP-CDU-003.pdf"
    doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=100)
    story = []
    
    story.append(Paragraph("Standard Operating Procedure", title_style))
    story.append(Paragraph("Startup Procedure for Crude Distillation Unit Atmospheric Column", h2_style))
    story.append(Paragraph("Document No: BPL-SOP-CDU-003 | Rev: 02", h2_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("1. Purpose", h1_style))
    story.append(Paragraph("To define the safe and structured startup procedure for the CDU Atmospheric Column C-101 following a planned turnaround or emergency shutdown.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("2. Safety Precautions", h1_style))
    story.append(Paragraph("• Ensure all blinding is removed and signed off.", normal_style))
    story.append(Paragraph("• Verify H2S detectors are functional.", normal_style))
    story.append(Paragraph("• PPE Required: Fire Retardant Coveralls, Hard Hat, Safety Goggles, Gas Monitor.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("3. Step-by-Step Procedure", h1_style))
    steps = [
        "1. Nitrogen Purging: Establish N2 flow to C-101. Monitor O2 levels at overhead vent until O2 < 2%.",
        "2. Steam Out: Introduce low-pressure steam (LP) to the bottom of C-101 to displace N2 and heat the column.",
        "3. Circulation: Start crude circulation pump P-101A/B. Establish cold circulation through the desalter and heat exchanger train.",
        "4. Furnace F-101 Light Up: Ignite pilot burners on F-101. Slowly increase fuel gas flow. Ramp up temperature at 15°C/hr.",
        "5. Column Heating: As crude outlet temp reaches 250°C, monitor level in C-101 bottom. Start bottom pump P-102 when level reaches 40%."
    ]
    for step in steps:
        story.append(Paragraph(step, normal_style))
        story.append(Spacer(1, 6))
        
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"Created {filename}")

def create_incident_report():
    filename = SAMPLE_DIR / "BPL-IIR-2024-0023.pdf"
    doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=100)
    story = []
    
    story.append(Paragraph("Incident Investigation Report", title_style))
    story.append(Paragraph("Document No: BPL-IIR-2024-0023", h2_style))
    story.append(Spacer(1, 12))
    
    data = [
        ["Date of Incident", "2024-08-14 14:30", "Location", "Heat Exchanger E-103, CDU"],
        ["Incident Type", "Hydrocarbon Leak", "Severity", "Medium"],
    ]
    t = Table(data, colWidths=[100, 150, 100, 150])
    t.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#f0f0f0')),
    ]))
    story.append(t)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Description of Event", h1_style))
    story.append(Paragraph("During routine operator rounds, a minor naphtha leak (~2 liters/min) was observed from the tube-side flange of heat exchanger E-103. Area was immediately barricaded, and the bypass valve was opened to isolate E-103. Unit throughput was reduced by 10% during the isolation process.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Root Cause Analysis", h1_style))
    story.append(Paragraph("Investigation revealed that the spiral wound gasket (SS316/Graphite) had degraded. The root cause was determined to be improper torqueing during the last maintenance turnaround, leading to uneven compression and eventual failure due to thermal cycling.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Corrective Actions", h1_style))
    story.append(Paragraph("1. Replace gasket and torque to specification using a calibrated hydraulic torque wrench (Completed).", normal_style))
    story.append(Paragraph("2. Revise maintenance procedure to mandate QA/QC sign-off on torque values for all Class 300 flanges and above.", normal_style))
    
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"Created {filename}")

def create_equipment_history_csv():
    filename = SAMPLE_DIR / "BPL-Equipment-Failure-History.csv"
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["equipment_id", "equipment_name", "failure_date", "failure_mode", "root_cause", "downtime_hours", "repair_cost", "severity"])
        
        data = [
            ["P-101A", "Centrifugal Pump P-101A", "2024-07-20", "High Vibration", "Impeller Imbalance", "48", "15000", "critical"],
            ["P-101B", "Centrifugal Pump P-101B", "2023-11-05", "Seal Leak", "O-ring degradation", "12", "3000", "medium"],
            ["C-201", "Reciprocating Compressor C-201", "2024-02-14", "Valve Failure", "Fatigue", "72", "45000", "critical"],
            ["E-103", "Heat Exchanger E-103", "2024-08-14", "Flange Leak", "Improper Torqueing", "24", "5000", "medium"],
            ["V-305", "Control Valve V-305", "2024-05-10", "Stuck Open", "Actuator diaphragm rupture", "8", "1200", "low"],
            ["P-102", "Bottoms Pump P-102", "2023-09-22", "Bearing Failure", "Loss of lubrication", "36", "18000", "high"],
            ["F-101", "CDU Furnace F-101", "2024-01-08", "Burner fouling", "Poor fuel gas quality", "16", "8000", "high"],
        ]
        writer.writerows(data)
    print(f"Created {filename}")

def create_pid_description():
    filename = SAMPLE_DIR / "BPL-PID-CDU-001.pdf"
    doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=100)
    story = []
    
    story.append(Paragraph("Piping & Instrumentation Description", title_style))
    story.append(Paragraph("Document No: BPL-PID-CDU-001 | System: Crude Distillation Unit", h2_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Process Overview", h1_style))
    story.append(Paragraph("Raw crude oil from storage is pumped via P-101A/B through a series of pre-heat exchangers (E-101 to E-104) before entering the Desalter (D-101) to remove salts. The desalted crude is further heated and sent to the F-101 Furnace, where it is partially vaporized before entering the Atmospheric Column C-101.", normal_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Control Loops & Interlocks", h1_style))
    story.append(Paragraph("<b>FIC-101:</b> Controls raw crude flow rate. Cascaded with level controller LIC-201 on the desalter.", normal_style))
    story.append(Paragraph("<b>TIC-105:</b> Controls furnace outlet temperature by modulating fuel gas control valve TV-105A.", normal_style))
    story.append(Paragraph("<b>Interlock I-101:</b> On low crude flow (FAL-101), trip furnace F-101 to prevent tube coking.", normal_style))
    
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"Created {filename}")

if __name__ == "__main__":
    print("Generating sample industrial documents for BPL...")
    create_equipment_maintenance_log()
    create_safety_inspection_report()
    create_sop()
    create_incident_report()
    create_equipment_history_csv()
    create_pid_description()
    print("Done generating documents.")
