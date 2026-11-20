// ==================== ATTENDANCE ====================

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
import type { AttendanceRecord } from '../types';

const COLLECTIONS = {
  attendance: 'attendance'
} as const;

function col<T>(name: string) {
  return collection(getDb(), name) as CollectionReference<T>;
}

function now() {
  return Timestamp.now().toMillis();
}

function dayBounds(date: number) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = d.getTime();
  d.setHours(23, 59, 59, 999);
  const end = d.getTime();
  return { start, end };
}

export async function getAttendanceForDate(subjectId: string, date: number): Promise<AttendanceRecord[]> {
  const { start, end } = dayBounds(date);
  const q = query(
    col<AttendanceRecord>(COLLECTIONS.attendance),
    where('subjectId', '==', subjectId),
    where('date', '>=', start),
    where('date', '<=', end)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeAttendanceForDate(subjectId: string, date: number, callback: (records: AttendanceRecord[]) => void) {
  const { start, end } = dayBounds(date);
  const q = query(
    col<AttendanceRecord>(COLLECTIONS.attendance),
    where('subjectId', '==', subjectId),
    where('date', '>=', start),
    where('date', '<=', end)
  );
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function getAllAttendance(subjectId: string): Promise<AttendanceRecord[]> {
  const q = query(col<AttendanceRecord>(COLLECTIONS.attendance), where('subjectId', '==', subjectId), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<string> {
  const { id, ...data } = record;
  const ref = id ? doc(getDb(), COLLECTIONS.attendance, id) : doc(col<AttendanceRecord>(COLLECTIONS.attendance));
  await setDoc(ref, { ...data, id: ref.id, updatedAt: now() }, { merge: true });
  return ref.id;
}

export async function saveAttendanceRecords(records: (Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[]) {
  const batch = writeBatch(getDb());
  records.forEach(r => {
    const { id, ...data } = r;
    const ref = id ? doc(getDb(), COLLECTIONS.attendance, id) : doc(col<AttendanceRecord>(COLLECTIONS.attendance));
    batch.set(ref, { ...data, id: ref.id, updatedAt: now() }, { merge: true });
  });
  await batch.commit();
}

export async function deleteAttendanceRecord(id: string) {
  await deleteDoc(doc(getDb(), COLLECTIONS.attendance, id));
}