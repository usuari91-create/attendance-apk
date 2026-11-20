import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Divider, Avatar, Chip, CircularProgress } from '@mui/material';
import { ArrowBack, Add, Psychology, ThumbUp, ThumbDown, School, Visibility } from '@mui/icons-material';
import { useStudents } from '../hooks';
import { useBehavior } from '../hooks/useBehavior';
import { BehaviorDialog } from '../components/BehaviorDialog';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function BehaviorPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { students } = useStudents(subjectId || null);
  const { grades, add, getStudentGrade } = useBehavior(subjectId || null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const classAvg = grades.length > 0 ? (grades.reduce((a, b) => a + b.finalGrade, 0) / grades.length).toFixed(1) : '0.0';
  const totalPos = grades.reduce((a, b) => a + b.positiveCount, 0);
  const totalNeg = grades.reduce((a, b) => a + b.negativeCount, 0);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Box sx={{ flexGrow: 1 }}><Typography variant="h4" fontWeight={700}>Comportamiento</Typography><Typography color="text.secondary">{students.length} alumnos</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Nuevo registro</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}><Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ p: 2, borderRadius: 2, bgcolor: 'success.light' }}><School fontSize="large" color="success.main" /></Box><Box><Typography variant="h4" fontWeight={700}>{classAvg}/10</Typography><Typography variant="caption" color="text.secondary">Nota media</Typography></Box></Box></CardContent></Card></Grid>
        <Grid item xs={12} sm={4}><Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ p: 2, borderRadius: 2, bgcolor: 'success.light' }}><ThumbUp fontSize="large" color="success.main" /></Box><Box><Typography variant="h4" fontWeight={700}>{totalPos}</Typography><Typography variant="caption" color="text.secondary">Positivos</Typography></Box></Box></CardContent></Card></Grid>
        <Grid item xs={12} sm={4}><Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ p: 2, borderRadius: 2, bgcolor: 'error.light' }}><ThumbDown fontSize="large" color="error.main" /></Box><Box><Typography variant="h4" fontWeight={700}>{totalNeg}</Typography><Typography variant="caption" color="text.secondary">Negativos</Typography></Box></Box></CardContent></Card></Grid>
      </Grid>

      <Card sx={{ mb: 3 }}><CardContent>
        <Typography variant="h6" gutterBottom>Distribución de notas</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={grades.map((g, i) => ({ name: students.find(s => s.id === g.studentId)?.firstName || `A${i+1}`, grade: g.finalGrade }))}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[0, 10]} /><Tooltip formatter={(v: number) => [`${v.toFixed(1)}/10`, 'Nota']} />
            <Bar dataKey="grade" fill="#6200EE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent></Card>

      <Card variant="outlined">
        <List disablePadding>
          {students.map((student, index) => {
            const grade = getStudentGrade(student.id);
            return (
              <React.Fragment key={student.id}>
                <ListItem sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => setDialogOpen(true)} secondaryAction={<IconButton edge="end" onClick={e => { e.stopPropagation(); navigate(`/subject/${subjectId}/behavior/${student.id}`); }}><Visibility /></IconButton>}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: grade ? (grade.finalGrade >= 7 ? 'success.main' : grade.finalGrade >= 5 ? 'warning.main' : 'error.main') : 'default.main' }}>
                      {grade ? grade.finalGrade.toFixed(1) : '—'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1" fontWeight={600}>{student.firstName} {student.lastName}</Typography)} secondary={<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}><Chip label={`${grade?.positiveCount || 0} +`} icon={<ThumbUp fontSize="small" />} color="success" size="small" variant="outlined" /><Chip label={`${grade?.negativeCount || 0} -`} icon={<ThumbDown fontSize="small" />} color="error" size="small" variant="outlined" /><Chip label={`${(grade?.totalPoints ?? 0) > 0 ? '+' : ''}${grade?.totalPoints || 0}`} size="small" variant="outlined" /></Box>} />
                  <ListItemSecondaryAction><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{grade && <Typography variant="h6" fontWeight={700} sx={{ color: grade.finalGrade >= 7 ? 'success.main' : grade.finalGrade >= 5 ? 'warning.main' : 'error.main', minWidth: 50 }}>{grade.finalGrade.toFixed(1)}</Typography>}</Box></ListItemSecondaryAction>
                </ListItem>
                {index < students.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      </Card>

      <BehaviorDialog open={dialogOpen} onClose={() => setDialogOpen(false)} subjectId={subjectId!} students={students} categories={[]} onSave={add} />
    </Box>
  );
}