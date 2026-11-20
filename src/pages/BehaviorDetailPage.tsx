import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Divider, Chip, Avatar } from '@mui/material';
import { ArrowBack, Add, Psychology, ThumbUp, ThumbDown, Delete } from '@mui/icons-material';
import { useStudents } from '../hooks';
import { useBehavior } from '../hooks/useBehavior';
import { BehaviorDialog } from '../components/BehaviorDialog';
import { formatDate } from '../types';
import type { Student, BehaviorRecord, BehaviorGradeResult } from '../types';

export function BehaviorDetailPage() {
  const { subjectId, studentId } = useParams<{ subjectId: string; studentId: string }>();
  const navigate = useNavigate();
  const { students } = useStudents(subjectId || null);
  const student = students.find(s => s.id === studentId);
  const { records, add, remove, getStudentGrade } = useBehavior(subjectId || null, studentId);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<BehaviorRecord | null>(null);
  const grade = getStudentGrade(studentId || '');

  if (!student) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><Typography>Alumno no encontrado</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Box sx={{ flexGrow: 1 }}><Typography variant="h4" fontWeight={700}>{student.firstName} {student.lastName}</Typography><Typography color="text.secondary">Nº {student.studentNumber || '—'}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Añadir registro</Button>
      </Box>

      <Card sx={{ mb: 3 }}><CardContent>
        {grade ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: grade.finalGrade >= 7 ? 'success.light' : grade.finalGrade >= 5 ? 'warning.light' : 'error.light', minWidth: 100 }}>
              <Typography variant="h2" fontWeight={700} color={grade.finalGrade >= 7 ? 'success.main' : grade.finalGrade >= 5 ? 'warning.main' : 'error.main'}>{grade.finalGrade.toFixed(1)}</Typography>
              <Typography variant="body2" color="text.secondary">/ 10</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StatBox label="Positivos" value={grade.positiveCount} color="success" />
              <StatBox label="Negativos" value={grade.negativeCount} color="error" />
              <StatBox label="Puntos" value={grade.totalPoints > 0 ? `+${grade.totalPoints}` : grade.totalPoints} color="primary" />
            </Box>
          </Box>
        ) : <Typography color="text.secondary">Sin registros</Typography>}
      </CardContent></Card>

      <Card><CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Historial ({records.length})</Typography>
        </Box>
        {records.length === 0 ? <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center', display: 'block' }}>Sin registros</Typography> : (
          <List disablePadding>
            {records.map((record, index) => (
              <React.Fragment key={record.id}>
                <ListItem sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => setDeleteConfirm(record)} secondaryAction={<IconButton edge="end" onClick={e => { e.stopPropagation(); setDeleteConfirm(record); }}><Delete color="error" /></IconButton>}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: record.type === 'positive' ? 'success.light' : 'error.light' }}>
                      {record.type === 'positive' ? <ThumbUp fontSize="small" color="success.main" /> : <ThumbDown fontSize="small" color="error.main" />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1" fontWeight={600}>{record.category}</Typography)} secondary={<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}><Chip label={record.type === 'positive' ? '✓ Positivo' : '✗ Negativo'} size="small" color={record.type === 'positive' ? 'success' : 'error'} variant="outlined" /><Chip label={`${(record.points ?? 0) > 0 ? '+' : ''}${record.points}`} size="small" variant="outlined" /><Typography variant="caption" color="text.secondary">{formatDate(record.date)}</Typography></Box>} />
                </ListItem>
                {index < records.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent></Card>

      <BehaviorDialog open={dialogOpen} onClose={() => setDialogOpen(false)} subjectId={subjectId!} students={[student]} categories={[]} onSave={add} />
      {deleteConfirm && <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}><Typography>¿Eliminar "{deleteConfirm.category}" ({deleteConfirm.type === 'positive' ? '+' : ''}{deleteConfirm.points} pts)?</Typography><Button variant="contained" onClick={() => { remove(deleteConfirm.id); setDeleteConfirm(null); }}>Eliminar</Button></Box>}
    </Box>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: 'success' | 'error' | 'primary' }) {
  return <Box sx={{ textAlign: 'center', minWidth: 80 }}><Typography variant="h6" fontWeight={700}>{value}</Typography><Typography variant="caption" color="text.secondary">{label}</Typography></Box>;
}