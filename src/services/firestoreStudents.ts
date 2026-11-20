// ==================== STUDENTS ====================

import {
  collection,
  doc,
  getDocs,
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
import type { Student } from '../types';

const COLLECTIONS = {
  students: 'students'
} as const;

function col<T>(name: string) {
  return collection(getDb(), name) as CollectionReference<T>;
}

function now() {
  return Timestamp.now().toMillis();
}

export async function getStudents(subjectId: string): Promise<Student[]> {
  const q = query(col<Student>(COLLECTIONS.students), where('subjectId', '==', subjectId), orderBy('lastName'), orderBy('firstName'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeStudents(subjectId: string, callback: (students: Student[]) => void) {
  const q = query(col<Student>(COLLECTIONS.students), where('subjectId', '==', subjectId), orderBy('lastName'), orderBy('firstName'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(col<Student>(COLLECTIONS.students));
  await setDoc(ref, { ...data, createdAt: now(), updatedAt: now() });
  return ref.id;
}

export async function createStudents(students: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]) {
  const batch = writeBatch(getDb());
  students.forEach(s => {
    const ref = doc(col<Student>(COLLECTIONS.students));
    batch.set(ref, { ...s, createdAt: now(), updatedAt: now() });
  });
  await batch.commit();
}

export async function updateStudent(id: string, data: Partial<Student>) {
  await updateDoc(doc(getDb(), COLLECTIONS.students, id), { ...data, updatedAt: now() });
}

export async function deleteStudent(id: string) {
  await deleteDoc(doc(getDb(), COLLECTIONS.students, id));
}