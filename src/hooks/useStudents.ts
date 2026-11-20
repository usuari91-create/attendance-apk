import { useState, useEffect } from 'react';
import { subscribeStudents, createStudent, createStudents, updateStudent, deleteStudent, type Student } from '../services';

export function useStudents(subjectId: string | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) { setStudents([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeStudents(subjectId, (data) => {
      setStudents(data);
      setLoading(false);
    });
    return unsub;
  }, [subjectId]);

  const add = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'subjectId'>, sid: string) => {
    try { setError(null); return await createStudent({ ...data, subjectId: sid }); }
    catch (e) { setError('Error al añadir alumno'); throw e; }
  };

  const addMany = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'subjectId'>[], sid: string) => {
    try { setError(null); await createStudents(data.map(d => ({ ...d, subjectId: sid }))); }
    catch (e) { setError('Error al importar alumnos'); throw e; }
  };

  const update = async (id: string, data: Partial<Student>) => {
    try { setError(null); await updateStudent(id, data); }
    catch (e) { setError('Error al actualizar'); throw e; }
  };

  const remove = async (id: string) => {
    try { setError(null); await deleteStudent(id); }
    catch (e) { setError('Error al eliminar'); throw e; }
  };

  return { students, loading, error, add, addMany, update, remove };
}