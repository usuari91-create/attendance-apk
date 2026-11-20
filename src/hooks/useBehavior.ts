import { useState, useEffect } from 'react';
import { subscribeBehaviorRecords, getBehaviorRecords, createBehaviorRecord, updateBehaviorRecord, deleteBehaviorRecord, calculateAllBehaviorGrades, type BehaviorRecord, type BehaviorGradeResult, BEHAVIOR_CATEGORIES } from '../services';

export function useBehavior(subjectId: string | null, studentId?: string) {
  const [records, setRecords] = useState<BehaviorRecord[]>([]);
  const [grades, setGrades] = useState<BehaviorGradeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) { setRecords([]); setGrades([]); setLoading(false); return; }
    setLoading(true);
    let unsub: () => void;
    if (studentId) {
      unsub = subscribeBehaviorRecords(subjectId, studentId, (data) => { setRecords(data); setLoading(false); });
    } else {
      unsub = subscribeBehaviorRecords(subjectId, undefined, (data) => { setRecords(data); setLoading(false); });
      loadGrades(subjectId);
    }
    return unsub;
  }, [subjectId, studentId]);

  const loadGrades = async (sid: string) => {
    try { const g = await calculateAllBehaviorGrades(sid); setGrades(g); }
    catch (e) { setError('Error al calcular notas'); }
  };

  const add = async (data: Omit<BehaviorRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try { setError(null); await createBehaviorRecord(data); if (!studentId) loadGrades(subjectId!); }
    catch (e) { setError('Error al añadir registro'); throw e; }
  };

  const update = async (id: string, data: Partial<BehaviorRecord>) => {
    try { setError(null); await updateBehaviorRecord(id, data); if (!studentId) loadGrades(subjectId!); }
    catch (e) { setError('Error al actualizar'); throw e; }
  };

  const remove = async (id: string) => {
    try { setError(null); await deleteBehaviorRecord(id); if (!studentId) loadGrades(subjectId!); }
    catch (e) { setError('Error al eliminar'); throw e; }
  };

  const getStudentGrade = (sid: string) => grades.find(g => g.studentId === sid);
  const getStudentRecords = (sid: string) => records.filter(r => r.studentId === sid);

  return { records, grades, loading, error, add, update, remove, getStudentGrade, getStudentRecords, categories: BEHAVIOR_CATEGORIES };
}