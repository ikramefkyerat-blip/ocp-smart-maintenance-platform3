export type UserRole = 'administrator' | 'maintenance_engineer' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar_url?: string;
  site: string;
}

export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type OperatingStatus = 'RUNNING' | 'STANDBY' | 'MAINTENANCE' | 'BREAKDOWN' | 'DECOMMISSIONED';

export type SensorType = 'VIBRATION' | 'TEMPERATURE' | 'PRESSURE' | 'CURRENT' | 'SPEED' | 'FLOW' | 'LEVEL';
export type DocumentType = 'MANUAL' | 'ELECTRICAL_DRAWING' | 'MECHANICAL_DRAWING' | 'PDF' | 'IMAGE';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NotificationType = 
  | 'CRITICAL_FAILURE' 
  | 'RELIABILITY_ALERT' 
  | 'HEALTH_WARNING' 
  | 'MAINTENANCE_DUE' 
  | 'WORK_ORDER_UPDATE' 
  | 'INVENTORY_ALERT' 
  | 'INSPECTION_ALERT' 
  | 'SYSTEM_INFO';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MaintenancePriority = 'ROUTINE' | 'URGENT' | 'IMMEDIATE';

export interface Area {
  id: string;
  name: string;
  code: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  area_id: string;
}

export interface EquipmentType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface EquipmentDocument {
  id: string;
  title: string;
  file_url: string;
  document_type: DocumentType;
  file_format: string;
  equipment_id: string;
}

export interface Sensor {
  id: string;
  sensor_code: string;
  sensor_type: SensorType;
  model: string;
  manufacturer: string;
  sampling_rate: number;
  equipment_id: string;
  current_reading?: number;
  unit?: string;
  status: 'good' | 'warning' | 'critical';
}

export interface SensorData {
  id: string;
  timestamp: string;
  measured_value: number;
  unit: string;
  quality_flag: 'GOOD' | 'SUSPICIOUS' | 'INVALID';
  sensor_id: string;
}

export interface Equipment {
  id: string;
  equipment_code: string;
  name: string;
  description: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  commissioning_date: string;
  department_id: string;
  area_id: string;
  equipment_type_id: string;
  criticality: Criticality;
  operating_status: OperatingStatus;
  parent_equipment_id?: string | null;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Enriched fields for UI
  area_name?: string;
  department_name?: string;
  type_name?: string;
  mtbf_hours?: number;
  mttr_hours?: number;
  availability_pct?: number;
  status_color?: 'Green' | 'Orange' | 'Red';
  health_score?: number;
  failure_probability?: number;
  rul_hours?: number;
  risk_level?: RiskLevel;
  sensors?: Sensor[];
  documents?: EquipmentDocument[];
}

export interface FailureCategory {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface FailureCause {
  id: string;
  category_id: string;
  code: string;
  name: string;
  description: string;
}

export interface FailureHistory {
  id: string;
  equipment_id: string;
  failure_category_id: string;
  failure_cause_id: string;
  reported_by: string;
  start_time: string;
  end_time?: string | null;
  downtime_hours: number;
  production_loss: number; // In Tons of Phosphate / Product
  description: string;
  corrective_action?: string;
  root_cause?: string;
  verification_status: 'reported' | 'investigating' | 'resolved' | 'verified';
  status: string;
  created_at: string;

  // Joined metadata
  equipment_name?: string;
  equipment_code?: string;
  category_name?: string;
  cause_name?: string;
  reporter_name?: string;
}

export interface WorkOrder {
  id: string;
  work_order_number: string;
  maintenance_request_id?: string;
  equipment_id: string;
  assigned_to?: string;
  planned_start: string;
  planned_finish?: string;
  actual_start?: string;
  actual_finish?: string;
  maintenance_type: string; // 'Corrective' | 'Preventive' | 'Predictive'
  estimated_cost: number;
  actual_cost: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  
  equipment_name?: string;
  equipment_code?: string;
  assigned_name?: string;
}

export interface PMPlan {
  id: string;
  equipment_id: string;
  plan_name: string;
  frequency: number;
  frequency_unit: 'Days' | 'Weeks' | 'Months' | 'Hours';
  last_execution?: string;
  next_execution: string;
  maintenance_strategy: 'TBM' | 'CBM' | 'RCM';
  status: 'active' | 'due' | 'overdue' | 'completed';
  equipment_name?: string;
  equipment_code?: string;
}

export interface Inspection {
  id: string;
  equipment_id: string;
  inspector_id: string;
  inspection_date: string;
  overall_condition: 'Excellent' | 'Good' | 'Fair' | 'Critical';
  remarks?: string;
  checklist_count?: number;
  passed_count?: number;
  equipment_name?: string;
  inspector_name?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  color?: string;
  icon?: string;
  is_read: boolean;
  created_at: string;
  equipment_id?: string;
  equipment_code?: string;
  delivery_status?: 'sent' | 'delivered' | 'read';
}

export interface DashboardKPIs {
  total_equipment: number;
  running_equipment: number;
  standby_equipment: number;
  breakdown_equipment: number;
  maintenance_equipment: number;
  
  total_failures: number;
  mtbf_hours: number;
  mttr_hours: number;
  availability_pct: number;
  
  total_downtime_hours: number;
  total_production_loss: number;
  
  total_work_orders: number;
  open_work_orders: number;
  completed_work_orders: number;
}

export interface ParetoItem {
  label: string;
  failure_count: number;
  total_downtime: number;
  production_loss: number;
  percentage: number;
  cumulative_percentage: number;
}

export interface AIHealthScore {
  equipment_id: string;
  equipment_name: string;
  equipment_code: string;
  health_score: number;
  failure_probability: number;
  remaining_useful_life_hours: number;
  prediction_confidence: number;
  risk_level: RiskLevel;
  last_processed_at: string;
}

export interface MaintenanceRecommendation {
  equipment_id: string;
  equipment_code: string;
  equipment_name: string;
  recommended_action: string;
  reasoning: string;
  priority: MaintenancePriority;
  estimated_impact_on_health: number;
  potential_savings: number;
}
