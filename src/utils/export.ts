import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Student, AttendanceRecord, BehaviorRecord, BehaviorGradeResult, Subject } from '../types';
import { ATTENDANCE_STATUS } from '../types';

export function exportAttendanceToExcel(subject: Subject, students: Student[], records: AttendanceRecord[]) {
  const data = students.map(s => {
    const r = records.find(rec => rec.studentId === s.id);
    return {
      'Nº': s.studentNumber,
      'Alumno': `${s.firstName} ${s.lastName}`,
      'Estado': r ? ATTENDANCE_STATUS[r.status].label : 'Sin marcar',
      'Notas': r?.notes || ''
    };
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
  XLSX.writeFile(wb, `asistencia_${subject.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportBehaviorToExcel(subject: Subject, students: Student[], grades: BehaviorGradeResult[]) {
  const data = grades.map(g => {
    const s = students.find(st => st.id === g.studentId);
    return {
      'Nº': s?.studentNumber || '',
      'Alumno': s ? `${s.firstName} ${s.lastName}` : 'Desconocido',
      'Nota Conducta': g.finalGrade.toFixed(1),
      'Puntos Totales': g.totalPoints,
      'Positivos': g.positiveCount,
      'Negativos': g.negativeCount
    };
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Conducta');
  XLSX.writeFile(wb, `conducta_${subject.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportBehaviorDetailToExcel(student: Student, records: BehaviorRecord[]) {
  const data = records.map(r => ({
    'Fecha': new Date(r.date).toLocaleDateString('es-ES'),
    'Hora': new Date(r.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    'Tipo': r.type === 'positive' ? '✓ Positivo' : '✗ Negativo',
    'Categoría': r.category,
    'Descripción': r.description,
    'Puntos': r.points
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Detalle');
  XLSX.writeFile(wb, `conducta_${student.firstName}_${student.lastName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportAttendanceToPDF(subject: Subject, students: Student[], records: AttendanceRecord[], date: number) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Lista de Asistencia - ${subject.name}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 28);
  doc.text(`Código: ${subject.code}`, 14, 34);

  const data = students.map((s, i) => {
    const r = records.find(rec => rec.studentId === s.id);
    return [i + 1, s.studentNumber, `${s.firstName} ${s.lastName}`, r ? ATTENDANCE_STATUS[r.status].label : '—', r?.notes || ''];
  });

  autoTable(doc, {
    head: [['#', 'Nº', 'Alumno', 'Estado', 'Notas']],
    body: data,
    startY: 42,
    theme: 'striped',
    headStyles: { fillColor: [98, 0, 238] }
  });

  doc.save(`asistencia_${subject.name}_${new Date(date).toISOString().split('T')[0]}.pdf`);
}

export function exportBehaviorToPDF(subject: Subject, students: Student[], grades: BehaviorGradeResult[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Informe de Conducta - ${subject.name}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 28);
  doc.text(`Total alumnos: ${grades.length}`, 14, 34);

  const avg = grades.length > 0 ? (grades.reduce((a, b) => a + b.finalGrade, 0) / grades.length).toFixed(1) : '0.0';
  doc.text(`Nota media de clase: ${avg}/10`, 14, 40);

  const data = grades.map((g, i) => {
    const s = students.find(st => st.id === g.studentId);
    return [i + 1, s?.studentNumber || '', s ? `${s.firstName} ${s.lastName}` : 'Desconocido', g.finalGrade.toFixed(1), g.totalPoints, g.positiveCount, g.negativeCount];
  });

  autoTable(doc, {
    head: [['#', 'Nº', 'Alumno', 'Nota', 'Puntos', '+', '-']],
    body: data,
    startY: 48,
    theme: 'striped',
    headStyles: { fillColor: [98, 0, 238] }
  });

  doc.save(`conducta_${subject.name}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportBehaviorDetailToPDF(student: Student, records: BehaviorRecord[], grade: BehaviorGradeResult | null) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Detalle Conducta - ${student.firstName} ${student.lastName}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`Nº: ${student.studentNumber}  |  Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 28);

  if (grade) {
    doc.setFontSize(14);
    doc.text(`Nota Final: ${grade.finalGrade.toFixed(1)}/10`, 14, 38);
    doc.setFontSize(10);
    doc.text(`Puntos: ${grade.totalPoints}  |  Positivos: ${grade.positiveCount}  |  Negativos: ${grade.negativeCount}`, 14, 44);
  }

  const data = records.map(r => [
    new Date(r.date).toLocaleDateString('es-ES'),
    r.type === 'positive' ? '✓ Positivo' : '✗ Negativo',
    r.category,
    r.description,
    r.points.toString()
  ]);

  autoTable(doc, {
    head: [['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Pts']],
    body: data,
    startY: grade ? 52 : 38,
    theme: 'striped',
    headStyles: { fillColor: [98, 0, 238] }
  });

  doc.save(`conducta_${student.firstName}_${student.lastName}_${new Date().toISOString().split('T')[0]}.pdf`);
}