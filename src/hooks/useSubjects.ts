import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { subscribeSubjects, createSubject, updateSubject, deleteSubject, type Subject } from '../services';

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setSubjects([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeSubjects(user.uid, (data) => {
      setSubjects(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const add = async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'teacherId'>) => {
    try { setError(null); return await createSubject({ ...data, teacherId: user!.uid }); }
    catch (e) { setError('Error al crear asignatura'); throw e; }
  };

  const update = async (id: string, data: Partial<Subject>) => {
    try { setError(null); await updateSubject(id, data); }
    catch (e) { setError('Error al actualizar'); throw e; }
  };

  const remove = async (id: string) => {
    try { setError(null); await deleteSubject(id); }
    catch (e) { setError('Error al eliminar'); throw e; }
  };

  return { subjects, loading, error, add, update, remove };
}