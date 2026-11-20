// ==================== BEHAVIOR ====================

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
  Timestamp,
  CollectionReference
} from 'firebase/firestore';
import { getDb } from '../config/firebase';
import type { BehaviorRecord, BehaviorGradeResult } from '../types';
import { getStudents } from './firestoreStudents';

const COLLECTIONS = {
  behavior: 'behavior'
} as const;

function col<T>(name: string) {
  return collection(getDb(), name) as CollectionReference<T>;
}

function now() {
  return Timestamp.now().toMillis();
}

export async function getBehaviorRecords(subjectId: string, studentId?: string): Promise<BehaviorRecord[]> {
  let q = query(col<BehaviorRecord>(COLLECTIONS.behavior), where('subjectId', '==', subjectId), orderBy('date', 'desc'));
  if (studentId) {
    q = query(col<BehaviorRecord>(COLLECTIONS.behavior), where('subjectId', '==', subjectId), where('studentId', '==', studentId), orderBy('date', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeBehaviorRecords(subjectId: string, studentId: string | undefined, callback: (records: BehaviorRecord[]) => void) {
  let q = query(col<BehaviorRecord>(COLLECTIONS.behavior), where('subjectId', '==', subjectId), orderBy('date', 'desc'));
  if (studentId) {
    q = query(col<BehaviorRecord>(COLLECTIONS.behavior), where('subjectId', '==', subjectId), where('studentId', '==', studentId), orderBy('date', 'desc'));
  }
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function createBehaviorRecord(data: Omit<BehaviorRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(col<BehaviorRecord>(COLLECTIONS.behavior));
  await setDoc(ref, { ...data, createdAt: now(), updatedAt: now() });
  return ref.id;
}

export async function updateBehaviorRecord(id: string, data: Partial<BehaviorRecord>) {
  await updateDoc(doc(getDb(), COLLECTIONS.behavior, id), { ...data, updatedAt: now() });
}

export async function deleteBehaviorRecord(id: string) {
  await deleteDoc(doc(getDb(), COLLECTIONS.behavior, id));
}

// ==================== GRADES ====================

export async function calculateBehaviorGrade(subjectId: string, studentId: string): Promise<BehaviorGradeResult> {
  const records = await getBehaviorRecords(subjectId, studentId);
  let totalPoints = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  const categoryBreakdown: Record<string, number> = {};

  records.forEach(r => {
    totalPoints += r.points;
    if (r.type === 'positive') positiveCount++;
    else negativeCount++;
    const key = `${r.type === 'positive' ? '✓' : '✗'} ${r.category}`;
    categoryBreakdown[key] = (categoryBreakdown[key] || 0) + r.points;
  });

  const finalGrade = Math.max(0, Math.min(10, 5 + totalPoints * 0.1));

  return { studentId, totalPoints, positiveCount, negativeCount, finalGrade, categoryBreakdown };
}

export async function calculateAllBehaviorGrades(subjectId: string): Promise<BehaviorGradeResult[]> {
  const students = await getStudents(subjectId);
  const results = await Promise.all(students.map(s => calculateBehaviorGrade(subjectId, s.id)));
  return results.sort((a, b) => b.finalGrade - a.finalGrade);
}