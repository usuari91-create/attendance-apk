import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Slider, Alert } from '@mui/material';
import type { BehaviorRecord, BehaviorCategory } from '../types';
import { BEHAVIOR_CATEGORIES } from '../types';

interface BehaviorDialogProps {
  open: boolean; onClose: () => void;
  subjectId: string; students: { id: string; firstName: string; lastName: string }[];
  categories: BehaviorCategory[]; onSave: (data: Omit<BehaviorRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loading?: boolean; initialData?: BehaviorRecord | null;
}

export function BehaviorDialog({ open, onClose, subjectId, students, categories, onSave, loading, initialData }: BehaviorDialogProps) {
  const [studentId, setStudentId] = React.useState(initialData?.studentId || students[0]?.id || '');
  const [type, setType] = React.useState<BehaviorRecord['type']>(initialData?.type || 'positive');
  const [category, setCategory] = React.useState(initialData?.category || categories.find(c => c.type === type)?.id || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [points, setPoints] = React.useState(initialData?.points || (type === 'positive' ? 1 : -1));
  const [error, setError] = React.useState('');

  const filteredCategories = categories.filter(c => c.type === type);

  React.useEffect(() => {
    if (initialData) { setStudentId(initialData.studentId); setType(initialData.type); setCategory(initialData.category); setDescription(initialData.description); setPoints(initialData.points); }
    else { setStudentId(students[0]?.id || ''); setType('positive'); setCategory(filteredCategories[0]?.id || ''); setDescription(''); setPoints(1); }
    setError('');
  }, [initialData, students, type]);

  React.useEffect(() => { if (!filteredCategories.find(c => c.id === category)) { setCategory(filteredCategories[0]?.id || ''); setPoints(filteredCategories[0]?.defaultPoints || (type === 'positive' ? 1 : -1)); } }, [type, filteredCategories]);

  const handleSave = () => { if (!studentId) { setError('Selecciona un alumno'); return; } if (!category) { setError('Selecciona una categoría'); return; } setError(''); onSave({ subjectId, studentId, type, category, description: description.trim(), points, date: Date.now() }); onClose(); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Registro' : 'Nuevo Registro de Comportamiento'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}><FormControl fullWidth><InputLabel id="student-label">Alumno</InputLabel><Select labelId="student-label" value={studentId} label="Alumno" onChange={e => setStudentId(e.target.value)}>{students.map(s => <MenuItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</MenuItem>)}</Select></FormControl></Grid>
          <Grid item xs={12}><Box sx={{ mb: 1 }}><Typography variant="body2" color="text.secondary" gutterBottom>Tipo</Typography><Box sx={{ display: 'flex', gap: 2 }}><Button variant={type === 'positive' ? 'contained' : 'outlined'} color="success" onClick={() => setType('positive')} sx={{ flex: 1 }}>Positivo</Button><Button variant={type === 'negative' ? 'contained' : 'outlined'} color="error" onClick={() => setType('negative')} sx={{ flex: 1 }}>Negativo</Button></Box></Box></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel id="category-label">Categoría</InputLabel><Select labelId="category-label" value={category} label="Categoría" onChange={e => { setCategory(e.target.value); const cat = filteredCategories.find(c => c.id === e.target.value); if (cat) setPoints(cat.defaultPoints); }}>{filteredCategories.map(c => <MenuItem key={c.id} value={c.id}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c.color }} /><Typography>{c.name}</Typography><Typography variant="caption" color="text.secondary">({c.defaultPoints > 0 ? '+' : ''}{c.defaultPoints} pts)</Typography></Box></MenuItem>)}</Select></FormControl></Grid>
          <Grid item xs={12}><TextField fullWidth label="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej: Ayudó a un compañero con los ejercicios" /></Grid>
          <Grid item xs={12}><Typography variant="body2" color="text.secondary" gutterBottom>Puntos: <strong>{points > 0 ? '+' : ''}{points}</strong></Typography><Slider value={points} onChange={e => setPoints(e.target.value)} min={type === 'positive' ? 1 : -5} max={type === 'positive' ? 5 : -1} step={1} marks={Array.from({ length: 5 }, (_, i) => i + 1).map(v => ({ value: type === 'positive' ? v : -v, label: (type === 'positive' ? '+' : '') + v }))} valueLabelDisplay="auto" aria-label="Puntos" /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Añadir'}</Button></DialogActions>
    </Dialog>
  );
}