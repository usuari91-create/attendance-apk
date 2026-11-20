import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography, Alert } from '@mui/material';
import type { Student } from '../types';

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'subjectId'>) => void;
  initialData?: Student | null;
  loading?: boolean;
}

export function StudentDialog({ open, onClose, onSave, initialData, loading }: StudentDialogProps) {
  const [firstName, setFirstName] = React.useState(initialData?.firstName || '');
  const [lastName, setLastName] = React.useState(initialData?.lastName || '');
  const [studentNumber, setStudentNumber] = React.useState(initialData?.studentNumber || '');
  const [email, setEmail] = React.useState(initialData?.email || '');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setStudentNumber(initialData.studentNumber);
      setEmail(initialData.email);
    } else {
      setFirstName(''); setLastName(''); setStudentNumber(''); setEmail('');
    }
    setError('');
  }, [initialData]);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) { setError('Nombre y apellidos son obligatorios'); return; }
    setError('');
    onSave({ firstName: firstName.trim(), lastName: lastName.trim(), studentNumber: studentNumber.trim(), email: email.trim(), photoUrl: undefined });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Alumno' : 'Nuevo Alumno'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} required autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Apellidos" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Número (opcional)" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} placeholder="Ej: 12" type="number" inputProps={{ min: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email (opcional)" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="alumno@ejemplo.com" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading || !firstName.trim() || !lastName.trim()}>
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Añadir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}