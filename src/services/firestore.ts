import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  Timestamp,
  CollectionReference
} from 'firebase/firestore';
import { getDb } from '../config/firebase';
import type { Subject, Student, AttendanceRecord, BehaviorRecord, BehaviorGradeResult } from '../types';

const COLLECTIONS = {
  subjects: 'subjects',
  students: 'students',
  attendance: 'attendance',
  behavior: 'behavior'
} as const;

function col<T>(name: string) {
  return collection(getDb(), name) as CollectionReference<T>;
}

function now() {
  return Timestamp.now().toMillis();
}

// ==================== SUBJECTS ====================

export async function getSubjects(teacherId: string): Promise<Subject[]> {
  const q = query(col<Subject>(COLLECTIONS.subjects), where('teacherId', '==', teacherId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeSubjects(teacherId: string, callback: (subjects: Subject[]) => void) {
  const q = query(col<Subject>(COLLECTIONS.subjects), where('teacherId', '==', teacherId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function createSubject(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(col<Subject>(COLLECTIONS.subjects));
  await setDoc(ref, { ...data, createdAt: now(), updatedAt: now() });
  return ref.id;
}

export async function updateSubject(id: string, data: Partial<Subject>) {
  await updateDoc(doc(getDb(), COLLECTIONS.subjects, id), { ...data, updatedAt: now() });
}

export async function deleteSubject(id: string) {
  await deleteDoc(doc(getDb(), COLLECTIONS.subjects, id));
}