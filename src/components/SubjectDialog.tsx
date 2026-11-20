import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography } from '@mui/material';
import type { Subject } from '../types';

const COLORS = [
  '#6200EE', '#3700B3', '#018786', '#006064',
  '#B00020', '#7B1FA2', '#4A148C', '#004D40',
  '#BF360C', '#1A237E', '#311B92', '#0D47A1'
];

interface SubjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'teacherId' | 'studentIds'>) => void;
  initialData?: Subject | null;
  loading?: boolean;
}

export function SubjectDialog({ open, onClose, onSave, initialData, loading }: SubjectDialogProps) {
  const [name, setName] = React.useState(initialData?.name || '');
  const [code, setCode] = React.useState(initialData?.code || '');
  const [color, setColor] = React.useState(initialData?.color || COLORS[0]);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setColor(initialData.color);
    } else {
      setName(''); setCode(''); setColor(COLORS[0]);
    }
  }, [initialData]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), code: code.trim(), color, studentIds: [] });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Asignatura' : 'Nueva Asignatura'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Nombre" value={name} onChange={e => setName(e.target.value)}
              autoFocus required placeholder="Ej: Matemáticas 1º ESO"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Código (opcional)" value={code} onChange={e => setCode(e.target.value)}
              placeholder="Ej: MAT-1ESO"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Color</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <Box
                  key={c}
                  sx={{
                    width: 36, height: 36, borderRadius: 2,
                    bgcolor: c,
                    border: color === c ? '3px solid' : '2px solid transparent',
                    borderColor: color === c ? '#fff' : 'transparent',
                    boxShadow: color === c ? 2 : 0,
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading || !name.trim()}>
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}