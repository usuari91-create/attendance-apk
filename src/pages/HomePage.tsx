import React from 'react';
import { Grid, Box, Typography, Button, Fab, Card, CardContent, Alert, CircularProgress, IconButton, Chip, Avatar } from '@mui/material';
import { Add, School, People, CheckCircle, Psychology, Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from '../hooks';
import { SubjectCard } from '../components/SubjectCard';
import { SubjectDialog } from '../components/SubjectDialog';
import type { Subject } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const { subjects, loading, error, add, update, remove } = useSubjects();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);

  const handleAdd = () => { setEditingSubject(null); setDialogOpen(true); };
  const handleEdit = (subject: Subject) => { setEditingSubject(subject); setDialogOpen(true); };
  const handleSave = async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'teacherId' | 'studentIds'>) => {
    if (editingSubject) await update(editingSubject.id, data);
    else await add(data);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Mis Clases</Typography>
        <Fab variant="primary" onClick={handleAdd} size="large"><Add /></Fab>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : subjects.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>No hay asignaturas aún</Typography>
            <Typography color="text.secondary" paragraph>Crea tu primera clase para empezar a pasar lista</Typography>
            <Button variant="contained" size="large" onClick={handleAdd} startIcon={<Add />}>Crear primera clase</Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {subjects.map(subject => (
            <Grid item xs={12} sm={6} lg={4} key={subject.id}>
              <SubjectCard
                subject={subject}
                onEdit={handleEdit}
                onDelete={id => { if (window.confirm('¿Eliminar esta asignatura? Se borrarán todos sus alumnos y registros.')) remove(id); }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <SubjectDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingSubject(null); }}
        onSave={handleSave}
        initialData={editingSubject}
      />
    </Box>
  );
}