import { useState, useEffect } from 'react';
import { subscribeAttendanceForDate, getAttendanceForDate, saveAttendanceRecord, saveAttendanceRecords, type AttendanceRecord, getStartOfDay } from '../services';

export function useAttendance(subjectId: string | null, date: number) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) { setRecords([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeAttendanceForDate(subjectId, date, (data) => {
      setRecords(data);
      setLoading(false);
    });
    return unsub;
  }, [subjectId, date]);

  const getStatus = (studentId: string) => records.find(r => r.studentId === studentId)?.status ?? 'present';

  const save = async (studentId: string, status: AttendanceRecord['status'], notes = '') => {
    try {
      setError(null);
      await saveAttendanceRecord({ subjectId: subjectId!, studentId, date: getStartOfDay(date), status, notes });
    } catch (e) { setError('Error al guardar asistencia'); throw e; }
  };

  const saveAll = async (newRecords: (AttendanceRecord & { id?: string })[]) => {
    try { setError(null); await saveAttendanceRecords(newRecords); }
    catch (e) { setError('Error al guardar'); throw e; }
  };

  const quickToggle = (studentId: string) => {
    const current = getStatus(studentId);
    const next: AttendanceRecord['status'][] = ['present', 'absent', 'late', 'excused'];
    const idx = next.indexOf(current);
    save(studentId, next[(idx + 1) % 4]);
  };

  return { records, loading, error, getStatus, save, saveAll, quickToggle };
}