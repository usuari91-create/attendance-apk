import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Fab, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Avatar, Chip, Alert, CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { Add, Edit, Delete, ArrowBack, CheckCircle, Psychology } from '@mui/icons-material';
import { useStudents } from '../hooks';
import { StudentDialog } from '../components/StudentDialog';
import type { Student } from '../types';

export function StudentsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { students, loading, error, add, update, remove } = useStudents(subjectId || null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);

  const handleSave = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'subjectId'>) => {
    if (editingStudent) await update(editingStudent.id, data);
    else if (subjectId) await add(data, subjectId);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700}>Alumnos</Typography>
          <Typography color="text.secondary">{students.length} alumno{students.length !== 1 ? 's' : ''}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<CheckCircle />} onClick={() => navigate(`/subject/${subjectId}/attendance`)}>Asistencia</Button>
          <Button variant="outlined" startIcon={<Psychology />} onClick={() => navigate(`/subject/${subjectId}/behavior`)}>Conducta</Button>
          <Fab variant="primary" onClick={() => { setEditingStudent(null); setDialogOpen(true); }}><Add /></Fab>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : students.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>No hay alumnos</Typography>
            <Typography color="text.secondary" paragraph>Añade tu primer alumno</Typography>
            <Button variant="contained" size="large" onClick={() => { setEditingStudent(null); setDialogOpen(true); }} startIcon={<Add />}>Añadir alumno</Button>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined">
          <List disablePadding>
            {students.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem
                  sx={{ px: 2, py: 1 }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => { setEditingStudent(student); setDialogOpen(true); }}><Edit /></IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                      {student.firstName[0]}{student.lastName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight={600}>{student.firstName} {student.lastName}</Typography>}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        {student.studentNumber && <Chip label={`Nº ${student.studentNumber}`} size="small" variant="outlined" />}
                        {student.email && <Chip label={student.email} size="small" variant="outlined" color="secondary" />}
                      </Box>
                    }
                  />
                </ListItem>
                {index < students.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}

      <StudentDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingStudent(null); }}
        onSave={handleSave}
        initialData={editingStudent}
      />
    </Box>
  );
}