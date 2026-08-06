import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  Equipment,
  FailureHistory,
  WorkOrder,
  AppNotification,
  DashboardKPIs,
  ParetoItem,
  AIHealthScore,
  MaintenanceRecommendation,
  PMPlan
} from "./src/types.js";

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Seed Data for OCP Smart Maintenance Platform
let equipmentList: Equipment[] = [
  {
    id: "eq-1",
    equipment_code: "KHB-SLP-101",
    name: "Phosphate Slurry Pump P-101",
    description: "High-pressure centrifugal slurry pump for Khouribga washing plant slurry transport.",
    manufacturer: "Warman / Weir Minerals",
    model: "MCR-350 Heavy Duty",
    serial_number: "WM-2023-88491",
    installation_date: "2021-04-15",
    commissioning_date: "2021-05-01",
    department_id: "dept-1",
    department_name: "Washing & Beneficiation",
    area_id: "area-1",
    area_name: "Khouribga Mining Complex",
    equipment_type_id: "eqtype-1",
    type_name: "Slurry Pumps",
    criticality: "CRITICAL",
    operating_status: "RUNNING",
    status: "active",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 86400000 * 400).toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 480,
    mttr_hours: 14.5,
    availability_pct: 97.1,
    status_color: "Green",
    health_score: 84,
    failure_probability: 12,
    rul_hours: 1250,
    risk_level: "LOW",
    sensors: [
      { id: "s-1", sensor_code: "VIB-P101-DE", sensor_type: "VIBRATION", model: "Skf Multilog", manufacturer: "SKF", sampling_rate: 1000, equipment_id: "eq-1", current_reading: 3.4, unit: "mm/s RMS", status: "good" },
      { id: "s-2", sensor_code: "TMP-P101-BRG", sensor_type: "TEMPERATURE", model: "Pt100 RTD", manufacturer: "ABB", sampling_rate: 1, equipment_id: "eq-1", current_reading: 68.5, unit: "°C", status: "good" },
      { id: "s-3", sensor_code: "PRS-P101-OUT", sensor_type: "PRESSURE", model: "Rosemount 3051", manufacturer: "Emerson", sampling_rate: 10, equipment_id: "eq-1", current_reading: 12.8, unit: "bar", status: "good" }
    ],
    documents: [
      { id: "doc-1", title: "Operation & Maintenance Manual", file_url: "#", document_type: "MANUAL", file_format: "PDF", equipment_id: "eq-1" },
      { id: "doc-2", title: "Mechanical Sectional Assembly Drawing", file_url: "#", document_type: "MECHANICAL_DRAWING", file_format: "CAD/PDF", equipment_id: "eq-1" }
    ]
  },
  {
    id: "eq-2",
    equipment_code: "JLF-CVB-204",
    name: "Main Overland Conveyor CV-204",
    description: "4.2 km overland belt conveyor carrying rock phosphate from Khouribga to Jorf Lasfar slurry line.",
    manufacturer: "REI-France / Continental",
    model: "ST-3150 Steel Cord",
    serial_number: "REI-2019-0941",
    installation_date: "2019-08-10",
    commissioning_date: "2019-11-01",
    department_id: "dept-2",
    department_name: "Rock Handling & Logistics",
    area_id: "area-2",
    area_name: "Jorf Lasfar Chemical Complex",
    equipment_type_id: "eqtype-2",
    type_name: "Belt Conveyors",
    criticality: "CRITICAL",
    operating_status: "BREAKDOWN",
    status: "active",
    image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 86400000 * 600).toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 190,
    mttr_hours: 32.0,
    availability_pct: 85.6,
    status_color: "Red",
    health_score: 42,
    failure_probability: 78,
    rul_hours: 120,
    risk_level: "CRITICAL",
    sensors: [
      { id: "s-4", sensor_code: "VIB-CV204-GBX", sensor_type: "VIBRATION", model: "Bentley Nevada 3500", manufacturer: "GE", sampling_rate: 2000, equipment_id: "eq-2", current_reading: 8.9, unit: "mm/s RMS", status: "critical" },
      { id: "s-5", sensor_code: "TMP-CV204-MOT", sensor_type: "TEMPERATURE", model: "WIKA Thermocouple", manufacturer: "WIKA", sampling_rate: 1, equipment_id: "eq-2", current_reading: 94.2, unit: "°C", status: "critical" }
    ],
    documents: [
      { id: "doc-3", title: "Belt Splice & Tensioning Guide", file_url: "#", document_type: "MANUAL", file_format: "PDF", equipment_id: "eq-2" }
    ]
  },
  {
    id: "eq-3",
    equipment_code: "JLF-BLM-301",
    name: "SAG Grinding Ball Mill BM-301",
    description: "Primary wet grinding ball mill for raw phosphate rock particle reduction.",
    manufacturer: "Metso Outotec",
    model: "SAG 6.5m x 11.0m Dual Pinion",
    serial_number: "MO-SAG-2020-004",
    installation_date: "2020-02-14",
    commissioning_date: "2020-06-15",
    department_id: "dept-1",
    department_name: "Washing & Beneficiation",
    area_id: "area-2",
    area_name: "Jorf Lasfar Chemical Complex",
    equipment_type_id: "eqtype-3",
    type_name: "Grinding Mills",
    criticality: "HIGH",
    operating_status: "MAINTENANCE",
    status: "active",
    image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 86400000 * 500).toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 310,
    mttr_hours: 24.0,
    availability_pct: 92.8,
    status_color: "Orange",
    health_score: 65,
    failure_probability: 45,
    rul_hours: 480,
    risk_level: "HIGH",
    sensors: [
      { id: "s-6", sensor_code: "VIB-BM301-PIN", sensor_type: "VIBRATION", model: "Vibrocontrol 6000", manufacturer: "Brüel & Kjær", sampling_rate: 5000, equipment_id: "eq-3", current_reading: 4.8, unit: "mm/s RMS", status: "warning" },
      { id: "s-7", sensor_code: "CUR-BM301-DRV", sensor_type: "CURRENT", model: "ABB ACS880 CT", manufacturer: "ABB", sampling_rate: 50, equipment_id: "eq-3", current_reading: 420, unit: "A", status: "good" }
    ],
    documents: [
      { id: "doc-4", title: "Liner Replacement & Pinion Backlash Protocol", file_url: "#", document_type: "MANUAL", file_format: "PDF", equipment_id: "eq-3" }
    ]
  },
  {
    id: "eq-4",
    equipment_code: "SAF-RDY-402",
    name: "Phosphate Granulation Rotary Dryer RD-402",
    description: "Gas-fired rotary dryer drum for drying TSP / DAP fertilizer granules.",
    manufacturer: "FEECO International",
    model: "RD-3800 Direct Fired",
    serial_number: "FEECO-2018-7712",
    installation_date: "2018-05-20",
    commissioning_date: "2018-09-01",
    department_id: "dept-3",
    department_name: "Granulation & Fertilizer",
    area_id: "area-3",
    area_name: "Safi Chemical Plant",
    equipment_type_id: "eqtype-4",
    type_name: "Rotary Dryers",
    criticality: "HIGH",
    operating_status: "RUNNING",
    status: "active",
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 86400000 * 700).toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 560,
    mttr_hours: 12.0,
    availability_pct: 97.9,
    status_color: "Green",
    health_score: 91,
    failure_probability: 8,
    rul_hours: 2100,
    risk_level: "LOW",
    sensors: [
      { id: "s-8", sensor_code: "TMP-RD402-GAS", sensor_type: "TEMPERATURE", model: "Endress+Hauser Thermophant", manufacturer: "E+H", sampling_rate: 1, equipment_id: "eq-4", current_reading: 340.0, unit: "°C", status: "good" }
    ],
    documents: []
  },
  {
    id: "eq-5",
    equipment_code: "JLF-AR-701",
    name: "Phosphoric Acid Reactor AR-701",
    description: "Agitated rubber-lined reactor vessel for sulfuric acid attack on phosphate rock.",
    manufacturer: "Prayon Technologies",
    model: "Mark IV Multi-Compartment",
    serial_number: "PR-2022-0012",
    installation_date: "2022-01-10",
    commissioning_date: "2022-04-01",
    department_id: "dept-4",
    department_name: "Phosphoric Acid Plant",
    area_id: "area-2",
    area_name: "Jorf Lasfar Chemical Complex",
    equipment_type_id: "eqtype-5",
    type_name: "Chemical Reactors",
    criticality: "CRITICAL",
    operating_status: "RUNNING",
    status: "active",
    image_url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 86400000 * 300).toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 620,
    mttr_hours: 18.0,
    availability_pct: 97.2,
    status_color: "Green",
    health_score: 88,
    failure_probability: 14,
    rul_hours: 1850,
    risk_level: "LOW",
    sensors: [
      { id: "s-9", sensor_code: "VIB-AR701-AGT", sensor_type: "VIBRATION", model: "SKF Vibration Transmitter", manufacturer: "SKF", sampling_rate: 1000, equipment_id: "eq-5", current_reading: 2.1, unit: "mm/s RMS", status: "good" }
    ],
    documents: []
  }
];

let failureHistoryList: FailureHistory[] = [
  {
    id: "fh-1",
    equipment_id: "eq-2",
    equipment_name: "Main Overland Conveyor CV-204",
    equipment_code: "JLF-CVB-204",
    failure_category_id: "fc-1",
    category_name: "Mechanical Failure",
    failure_cause_id: "fcs-1",
    cause_name: "Gearbox Bearing Seizure",
    reported_by: "Ing. Youssef El Mansouri",
    start_time: new Date(Date.now() - 3600000 * 14).toISOString(),
    end_time: null,
    downtime_hours: 14,
    production_loss: 4200, // Tons of rock
    description: "Excessive vibration and gear teeth grinding noise led to automatic trip. Bearing DE overheated above 94°C.",
    corrective_action: "Gearbox disassembly, replacement of spherical roller bearing, alignment verification.",
    root_cause: "Lubrication degradation due to dust ingress at seals.",
    verification_status: "investigating",
    status: "active",
    created_at: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: "fh-2",
    equipment_id: "eq-3",
    equipment_name: "SAG Grinding Ball Mill BM-301",
    equipment_code: "JLF-BLM-301",
    failure_category_id: "fc-2",
    category_name: "Electrical Failure",
    failure_cause_id: "fcs-2",
    cause_name: "VFD Drive Thyristor Fault",
    reported_by: "Tech. Mehdi Tazi",
    start_time: new Date(Date.now() - 86400000 * 3).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 2).toISOString(),
    downtime_hours: 24,
    production_loss: 6800,
    description: "Drive trip F-0421 during load acceleration phase.",
    corrective_action: "Replaced SCR module 3 in phase B cabinet, recalibrated gate pulse triggers.",
    root_cause: "Cooling fan filter clogging causing localized power semiconductor thermal overload.",
    verification_status: "resolved",
    status: "closed",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "fh-3",
    equipment_id: "eq-1",
    equipment_name: "Phosphate Slurry Pump P-101",
    equipment_code: "KHB-SLP-101",
    failure_category_id: "fc-3",
    category_name: "Hydraulic & Wear Failure",
    failure_cause_id: "fcs-3",
    cause_name: "Impeller Erosion & Gland Leak",
    reported_by: "Ing. Fatima-Zahra Alami",
    start_time: new Date(Date.now() - 86400000 * 12).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 11.4).toISOString(),
    downtime_hours: 14.5,
    production_loss: 2900,
    description: "Slurry flow discharge pressure drop from 14.2 bar to 9.8 bar. Severe mechanical seal leak.",
    corrective_action: "Swapped worn high-chrome impeller and throat bush. Repacked gland seal.",
    root_cause: "Abrasive coarse phosphate rock slurry content higher than design specification.",
    verification_status: "verified",
    status: "closed",
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: "fh-4",
    equipment_id: "eq-2",
    equipment_name: "Main Overland Conveyor CV-204",
    equipment_code: "JLF-CVB-204",
    failure_category_id: "fc-1",
    category_name: "Mechanical Failure",
    failure_cause_id: "fcs-4",
    cause_name: "Belt Tear / Splice Failure",
    reported_by: "Tech. Omar Bennis",
    start_time: new Date(Date.now() - 86400000 * 25).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 23.8).toISOString(),
    downtime_hours: 28.8,
    production_loss: 8400,
    description: "Longitudinal 12m rip caused by trapped tramp metal at chute load zone.",
    corrective_action: "Vulcanized belt hot patch repair and magnetic separator magnet strength tuning.",
    root_cause: "Upstream chute liner wear allowing tramp steel scrap to pierce rubber cover.",
    verification_status: "verified",
    status: "closed",
    created_at: new Date(Date.now() - 86400000 * 25).toISOString()
  }
];

let notificationsList: AppNotification[] = [
  {
    id: "notif-1",
    title: "CRITICAL: Conveyor CV-204 Trip & Breakdown",
    message: "Overland Conveyor CV-204 tripped on high vibration (8.9 mm/s RMS). Gearbox bearing seizure suspected.",
    type: "CRITICAL_FAILURE",
    priority: "CRITICAL",
    color: "#ef4444",
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    equipment_id: "eq-2",
    equipment_code: "JLF-CVB-204"
  },
  {
    id: "notif-2",
    title: "HEALTH WARNING: SAG Mill BM-301 Score Dropped to 65%",
    message: "AI Health Index for Ball Mill BM-301 dropped below 70%. RUL estimated at 480 operating hours.",
    type: "HEALTH_WARNING",
    priority: "HIGH",
    color: "#f59e0b",
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    equipment_id: "eq-3",
    equipment_code: "JLF-BLM-301"
  },
  {
    id: "notif-3",
    title: "PM PLAN DUE: Slurry Pump P-101 500H Service",
    message: "Preventive Maintenance TBM-500H (Bearing Lubrication & Gland Packing Check) is due tomorrow.",
    type: "MAINTENANCE_DUE",
    priority: "MEDIUM",
    color: "#3b82f6",
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    equipment_id: "eq-1",
    equipment_code: "KHB-SLP-101"
  }
];

let workOrdersList: WorkOrder[] = [
  {
    id: "wo-1",
    work_order_number: "WO-2025-0841",
    equipment_id: "eq-2",
    equipment_name: "Main Overland Conveyor CV-204",
    equipment_code: "JLF-CVB-204",
    assigned_to: "Ing. Youssef El Mansouri",
    planned_start: new Date(Date.now() - 3600000 * 12).toISOString(),
    actual_start: new Date(Date.now() - 3600000 * 10).toISOString(),
    maintenance_type: "Corrective",
    estimated_cost: 14500,
    actual_cost: 0,
    status: "in_progress",
    created_at: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: "wo-2",
    work_order_number: "WO-2025-0838",
    equipment_id: "eq-3",
    equipment_name: "SAG Grinding Ball Mill BM-301",
    equipment_code: "JLF-BLM-301",
    assigned_to: "Tech. Mehdi Tazi",
    planned_start: new Date(Date.now() - 86400000 * 3).toISOString(),
    actual_start: new Date(Date.now() - 86400000 * 3).toISOString(),
    actual_finish: new Date(Date.now() - 86400000 * 2).toISOString(),
    maintenance_type: "Corrective",
    estimated_cost: 8200,
    actual_cost: 7900,
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

let pmPlansList: PMPlan[] = [
  {
    id: "pm-1",
    equipment_id: "eq-1",
    equipment_name: "Phosphate Slurry Pump P-101",
    equipment_code: "KHB-SLP-101",
    plan_name: "Monthly Mechanical Seal & Gland Check",
    frequency: 1,
    frequency_unit: "Months",
    last_execution: new Date(Date.now() - 86400000 * 25).toISOString(),
    next_execution: new Date(Date.now() + 86400000 * 5).toISOString(),
    maintenance_strategy: "TBM",
    status: "active"
  },
  {
    id: "pm-2",
    equipment_id: "eq-2",
    equipment_name: "Main Overland Conveyor CV-204",
    equipment_code: "JLF-CVB-204",
    plan_name: "Vibration Diagnostic & Gearbox Oil Sampling",
    frequency: 2,
    frequency_unit: "Weeks",
    last_execution: new Date(Date.now() - 86400000 * 16).toISOString(),
    next_execution: new Date(Date.now() - 86400000 * 2).toISOString(),
    maintenance_strategy: "CBM",
    status: "overdue"
  },
  {
    id: "pm-3",
    equipment_id: "eq-4",
    equipment_name: "Phosphate Granulation Rotary Dryer RD-402",
    equipment_code: "SAF-RDY-402",
    plan_name: "Burner Nozzle Cleaning & Combustion Tuning",
    frequency: 3,
    frequency_unit: "Months",
    last_execution: new Date(Date.now() - 86400000 * 45).toISOString(),
    next_execution: new Date(Date.now() + 86400000 * 45).toISOString(),
    maintenance_strategy: "RCM",
    status: "active"
  }
];

// Helper Functions
const calculateKPIs = (): DashboardKPIs => {
  const total_equipment = equipmentList.length;
  const running_equipment = equipmentList.filter(e => e.operating_status === 'RUNNING').length;
  const standby_equipment = equipmentList.filter(e => e.operating_status === 'STANDBY').length;
  const breakdown_equipment = equipmentList.filter(e => e.operating_status === 'BREAKDOWN').length;
  const maintenance_equipment = equipmentList.filter(e => e.operating_status === 'MAINTENANCE').length;
  
  const total_failures = failureHistoryList.length;
  const total_downtime_hours = failureHistoryList.reduce((acc, f) => acc + f.downtime_hours, 0);
  const total_production_loss = failureHistoryList.reduce((acc, f) => acc + f.production_loss, 0);
  
  // Fleet average MTBF & MTTR
  const avg_mtbf = Math.round(equipmentList.reduce((acc, e) => acc + (e.mtbf_hours || 400), 0) / (total_equipment || 1));
  const avg_mttr = Number((equipmentList.reduce((acc, e) => acc + (e.mttr_hours || 18), 0) / (total_equipment || 1)).toFixed(1));
  
  // Availability calculation
  const total_operating_hours_fleet = total_equipment * 720; // 30 days
  const fleet_availability = Number((((total_operating_hours_fleet - total_downtime_hours) / total_operating_hours_fleet) * 100).toFixed(1));
  
  const total_work_orders = workOrdersList.length;
  const open_work_orders = workOrdersList.filter(w => w.status === 'open' || w.status === 'in_progress').length;
  const completed_work_orders = workOrdersList.filter(w => w.status === 'completed').length;

  return {
    total_equipment,
    running_equipment,
    standby_equipment,
    breakdown_equipment,
    maintenance_equipment,
    total_failures,
    mtbf_hours: avg_mtbf,
    mttr_hours: avg_mttr,
    availability_pct: fleet_availability,
    total_downtime_hours,
    total_production_loss,
    total_work_orders,
    open_work_orders,
    completed_work_orders
  };
};

// --- API ENDPOINTS ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "OCP Smart Maintenance Platform", timestamp: new Date().toISOString() });
});

// 2. Dashboard KPIs
app.get("/api/dashboard/kpis", (req, res) => {
  res.json(calculateKPIs());
});

// 3. Equipment Endpoints
app.get("/api/equipment", (req, res) => {
  const { area_id, department_id, criticality, status } = req.query;
  let filtered = [...equipmentList];
  if (area_id) filtered = filtered.filter(e => e.area_id === area_id);
  if (department_id) filtered = filtered.filter(e => e.department_id === department_id);
  if (criticality) filtered = filtered.filter(e => e.criticality === criticality);
  if (status) filtered = filtered.filter(e => e.operating_status === status);

  res.json(filtered);
});

app.get("/api/equipment/:id", (req, res) => {
  const item = equipmentList.find(e => e.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Equipment not found" });
  }
  res.json(item);
});

app.post("/api/equipment", (req, res) => {
  const newEq: Equipment = {
    id: `eq-${Date.now()}`,
    equipment_code: req.body.equipment_code || `OCP-EQ-${Math.floor(Math.random() * 900 + 100)}`,
    name: req.body.name,
    description: req.body.description || "",
    manufacturer: req.body.manufacturer || "General Industrial",
    model: req.body.model || "Standard Series",
    serial_number: req.body.serial_number || `SN-${Math.random().toString(36).substring(7).toUpperCase()}`,
    installation_date: req.body.installation_date || new Date().toISOString().split('T')[0],
    commissioning_date: req.body.commissioning_date || new Date().toISOString().split('T')[0],
    department_id: req.body.department_id || "dept-1",
    department_name: req.body.department_name || "Washing & Beneficiation",
    area_id: req.body.area_id || "area-1",
    area_name: req.body.area_name || "Khouribga Mining Complex",
    equipment_type_id: req.body.equipment_type_id || "eqtype-1",
    type_name: req.body.type_name || "Slurry Pumps",
    criticality: req.body.criticality || "MEDIUM",
    operating_status: req.body.operating_status || "RUNNING",
    status: "active",
    image_url: req.body.image_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    mtbf_hours: 500,
    mttr_hours: 12,
    availability_pct: 98.0,
    status_color: "Green",
    health_score: 95,
    failure_probability: 5,
    rul_hours: 2400,
    risk_level: "LOW",
    sensors: [],
    documents: []
  };

  equipmentList.unshift(newEq);
  res.status(201).json(newEq);
});

// 4. Failure History & Automatic Work Order Generation
app.get("/api/failures", (req, res) => {
  res.json(failureHistoryList);
});

app.post("/api/failures", (req, res) => {
  const { equipment_id, category_name, cause_name, description, reported_by, production_loss, downtime_hours } = req.body;
  
  const eq = equipmentList.find(e => e.id === equipment_id);
  const eqName = eq ? eq.name : "Unknown Equipment";
  const eqCode = eq ? eq.equipment_code : "OCP-EQ";
  const downtime = Number(downtime_hours) || 6;

  // Create failure entry
  const newFailure: FailureHistory = {
    id: `fh-${Date.now()}`,
    equipment_id,
    equipment_name: eqName,
    equipment_code: eqCode,
    failure_category_id: "fc-gen",
    category_name: category_name || "Mechanical Failure",
    failure_cause_id: "fcs-gen",
    cause_name: cause_name || "Component Breakdown",
    reported_by: reported_by || "Shift Maintenance Supervisor",
    start_time: new Date().toISOString(),
    end_time: null,
    downtime_hours: downtime,
    production_loss: Number(production_loss) || 1500,
    description: description || "Unscheduled breakdown reported on plant line.",
    verification_status: "investigating",
    status: "active",
    created_at: new Date().toISOString()
  };

  failureHistoryList.unshift(newFailure);

  // Update Equipment Status to BREAKDOWN & adjust MTBF/Availability
  if (eq) {
    eq.operating_status = "BREAKDOWN";
    eq.status_color = "Red";
    eq.health_score = Math.max(10, (eq.health_score || 80) - 35);
    eq.failure_probability = Math.min(95, (eq.failure_probability || 20) + 40);
    eq.risk_level = "CRITICAL";
    eq.updated_at = new Date().toISOString();
  }

  // Automatic Work Order Generation (Requirement from OCP Business Logic!)
  const woNum = `WO-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
  const autoWO: WorkOrder = {
    id: `wo-${Date.now()}`,
    work_order_number: woNum,
    maintenance_request_id: `mr-${Date.now()}`,
    equipment_id,
    equipment_name: eqName,
    equipment_code: eqCode,
    assigned_to: "Duty Emergency Response Team",
    planned_start: new Date().toISOString(),
    maintenance_type: "Corrective",
    estimated_cost: 9500,
    actual_cost: 0,
    status: "in_progress",
    created_at: new Date().toISOString()
  };
  workOrdersList.unshift(autoWO);

  // Trigger Notification
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    title: `BREAKDOWN ALERT: ${eqCode} (${eqName})`,
    message: `Failure reported: ${cause_name || 'Component Breakdown'}. Emergency Work Order ${woNum} automatically dispatched.`,
    type: "CRITICAL_FAILURE",
    priority: "CRITICAL",
    color: "#ef4444",
    is_read: false,
    created_at: new Date().toISOString(),
    equipment_id,
    equipment_code: eqCode
  };
  notificationsList.unshift(newNotif);

  res.status(201).json({
    failure: newFailure,
    work_order: autoWO,
    notification: newNotif
  });
});

// 5. Pareto Analytics Endpoint (80/20 Rule)
app.get("/api/pareto", (req, res) => {
  const { groupBy } = req.query; // 'equipment' | 'cause' | 'category'
  
  const map = new Map<string, { count: number; downtime: number; loss: number }>();

  failureHistoryList.forEach(f => {
    let key = f.equipment_name || "Unknown";
    if (groupBy === 'cause') key = f.cause_name || "General Cause";
    if (groupBy === 'category') key = f.category_name || "General Category";

    const current = map.get(key) || { count: 0, downtime: 0, loss: 0 };
    map.set(key, {
      count: current.count + 1,
      downtime: current.downtime + f.downtime_hours,
      loss: current.loss + f.production_loss
    });
  });

  const rawList = Array.from(map.entries()).map(([label, val]) => ({
    label,
    failure_count: val.count,
    total_downtime: val.downtime,
    production_loss: val.loss
  }));

  // Sort descending by downtime
  rawList.sort((a, b) => b.total_downtime - a.total_downtime);

  const totalDowntimeFleet = rawList.reduce((acc, item) => acc + item.total_downtime, 0) || 1;

  let cumulativeSum = 0;
  const paretoData: ParetoItem[] = rawList.map(item => {
    const percentage = Number(((item.total_downtime / totalDowntimeFleet) * 100).toFixed(1));
    cumulativeSum += percentage;
    return {
      ...item,
      percentage,
      cumulative_percentage: Number(Math.min(100, cumulativeSum).toFixed(1))
    };
  });

  res.json(paretoData);
});

// 6. Work Orders & PM Plans
app.get("/api/workorders", (req, res) => {
  res.json(workOrdersList);
});

app.get("/api/pmplans", (req, res) => {
  res.json(pmPlansList);
});

// 7. Notifications API
app.get("/api/notifications", (req, res) => {
  res.json(notificationsList);
});

app.post("/api/notifications/read", (req, res) => {
  const { id } = req.body;
  if (id) {
    const notif = notificationsList.find(n => n.id === id);
    if (notif) notif.is_read = true;
  } else {
    notificationsList.forEach(n => n.is_read = true);
  }
  res.json({ success: true, count: notificationsList.filter(n => !n.is_read).length });
});

app.post("/api/notifications/clear", (req, res) => {
  notificationsList = [];
  res.json({ success: true });
});

// 8. AI Predictions & Copilot Endpoint (Gemini 3.6 Flash Server-Side Integration)
app.get("/api/ai/predictions", (req, res) => {
  const scores: AIHealthScore[] = equipmentList.map(eq => ({
    equipment_id: eq.id,
    equipment_name: eq.name,
    equipment_code: eq.equipment_code,
    health_score: eq.health_score || 85,
    failure_probability: eq.failure_probability || 15,
    remaining_useful_life_hours: eq.rul_hours || 1500,
    prediction_confidence: 94.2,
    risk_level: eq.risk_level || 'LOW',
    last_processed_at: new Date().toISOString()
  }));

  const recommendations: MaintenanceRecommendation[] = [
    {
      equipment_id: "eq-2",
      equipment_code: "JLF-CVB-204",
      equipment_name: "Main Overland Conveyor CV-204",
      recommended_action: "Perform immediate gearbox bearing replacement and laser shaft alignment.",
      reasoning: "High vibration spectrum peaks at 1X & 2X shaft frequency combined with motor thermal spike to 94.2°C.",
      priority: "IMMEDIATE",
      estimated_impact_on_health: 45,
      potential_savings: 65000
    },
    {
      equipment_id: "eq-3",
      equipment_code: "JLF-BLM-301",
      equipment_name: "SAG Grinding Ball Mill BM-301",
      recommended_action: "Schedule VFD inverter cabinet cooling duct inspection & replacement of internal filter mats.",
      reasoning: "Preventive action to avoid recurrence of thyristor over-temperature trips under peak grinding load.",
      priority: "URGENT",
      estimated_impact_on_health: 25,
      potential_savings: 32000
    },
    {
      equipment_id: "eq-1",
      equipment_code: "KHB-SLP-101",
      equipment_name: "Phosphate Slurry Pump P-101",
      recommended_action: "Inspect high-chrome liner wear during upcoming scheduled 500h TBM outage.",
      reasoning: "Abrasive slurry erosion trend indicates remaining liner thickness at 38%.",
      priority: "ROUTINE",
      estimated_impact_on_health: 15,
      potential_savings: 18000
    }
  ];

  res.json({ health_scores: scores, recommendations });
});

// AI Copilot Server Route
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { prompt, equipment_code, context } = req.body;
    
    const ai = getGenAI();
    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: `[OCP AI Copilot Simulation]\n\nAnalysis for ${equipment_code || 'Plant Equipment'}:\n- Based on recent telemetry (Vibration & Thermal trends), the system recommends inspecting mechanical seals and verifying bearing lubrication.\n- Calculated MTBF: 480 Hours.\n- Suggested Action: Schedule preventive check during next shift change.\n\n*Note: Add GEMINI_API_KEY in Secrets for live Gemini reasoning.*`,
        sources: ["OCP Maintenance Ontology v4", "SKF Vibration Standard ISO 10816"]
      });
    }

    // Build context rich prompt
    const systemInstruction = `You are the OCP Group Senior Predictive Maintenance & Reliability AI Copilot for phosphate mining, slurry pipelines, beneficiation plants, and fertilizer chemical complexes. 
You analyze equipment telemetry (Vibration mm/s RMS, Temperature °C, Flow, Pressure), MTBF/MTTR metrics, failure histories, and root cause analysis (RCA). 
Provide concise, highly authoritative engineering recommendations. Format with clear Markdown headings, bullet points, and actionable maintenance protocols.`;

    const fullPrompt = `Equipment Context: ${equipment_code ? equipment_code : 'Fleet Wide'}
Current Context Data: ${JSON.stringify(context || { fleet_size: equipmentList.length, breakdown_count: equipmentList.filter(e => e.operating_status === 'BREAKDOWN').length })}

User Query: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    res.json({
      reply: response.text,
      sources: ["OCP Maintenance Knowledge Base", "ISO 10816 Vibration Diagnostics", "Warman / Metso Engineering Specifications"]
    });
  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message
    });
  }
});

// Start Express + Vite Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OCP Smart Maintenance Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
