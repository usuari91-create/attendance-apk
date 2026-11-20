export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  studentIds: string[];
  teacherId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Student {
  id: string;
  subjectId: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  photoUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  studentId: string;
  date: number;
  status: AttendanceStatus;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type BehaviorType = 'positive' | 'negative';

export interface BehaviorRecord {
  id: string;
  subjectId: string;
  studentId: string;
  date: number;
  type: BehaviorType;
  category: string;
  description: string;
  points: number;
  createdAt: number;
  updatedAt: number;
}

export interface BehaviorCategory {
  id: string;
  name: string;
  type: BehaviorType;
  defaultPoints: number;
  color: string;
  isDefault: boolean;
}

export interface BehaviorGradeResult {
  studentId: string;
  totalPoints: number;
  positiveCount: number;
  negativeCount: number;
  finalGrade: number;
  categoryBreakdown: Record<string, number>;
}

export const ATTENDANCE_STATUS: Record<AttendanceStatus, { label: string; color: string; icon: string }> = {
  present: { label: 'Presente', color: '#4CAF50', icon: 'check_circle' },
  absent: { label: 'Ausente', color: '#F44336', icon: 'cancel' },
  late: { label: 'Tarde', color: '#FF9800', icon: 'schedule' },
  excused: { label: 'Justificado', color: '#2196F3', icon: 'do_not_disturb' }
};

export const BEHAVIOR_CATEGORIES: BehaviorCategory[] = [
  // Positivos
  { id: 'participation', name: 'Participación activa', type: 'positive', defaultPoints: 2, color: '#4CAF50', isDefault: true },
  { id: 'homework', name: 'Deberes completados', type: 'positive', defaultPoints: 1, color: '#8BC34A', isDefault: true },
  { id: 'help_others', name: 'Ayuda a compañeros', type: 'positive', defaultPoints: 2, color: '#00BCD4', isDefault: true },
  { id: 'leadership', name: 'Liderazgo', type: 'positive', defaultPoints: 3, color: '#9C27B0', isDefault: true },
  { id: 'creativity', name: 'Creatividad', type: 'positive', defaultPoints: 2, color: '#E91E63', isDefault: true },
  { id: 'effort', name: 'Esfuerzo destacado', type: 'positive', defaultPoints: 2, color: '#FF5722', isDefault: true },
  { id: 'custom_positive', name: 'Otro positivo', type: 'positive', defaultPoints: 1, color: '#607D8B', isDefault: false },
  // Negativos
  { id: 'disruption', name: 'Interrupción en clase', type: 'negative', defaultPoints: -2, color: '#F44336', isDefault: true },
  { id: 'late_work', name: 'Tareas tarde', type: 'negative', defaultPoints: -1, color: '#FF9800', isDefault: true },
  { id: 'missing_material', name: 'Material faltante', type: 'negative', defaultPoints: -1, color: '#FF5722', isDefault: true },
  { id: 'disrespect', name: 'Falta de respeto', type: 'negative', defaultPoints: -3, color: '#B71C1C', isDefault: true },
  { id: 'phone_use', name: 'Uso de móvil', type: 'negative', defaultPoints: -1, color: '#795548', isDefault: true },
  { id: 'custom_negative', name: 'Otro negativo', type: 'negative', defaultPoints: -1, color: '#607D8B', isDefault: false }
];