import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Card, CardContent, Grid, Alert, CircularProgress, FormControlLabel, Radio, RadioGroup, Chip } from '@mui/material';
import { ArrowBack, CalendarMonth, ChevronLeft, ChevronRight, Today, CheckCircle, Cancel, Schedule, DoNotDisturb, FileDownload, Visibility } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useStudents } from '../hooks';
import { useAttendance } from '../hooks/useAttendance';
import { exportAttendanceToExcel, exportAttendanceToPDF } from '../utils/export';
import { ATTENDANCE_STATUS } from '../types';
import { getStartOfDay, formatDate } from '../services';
import type { Student, AttendanceRecord } from '../types';

export function AttendancePage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { students, loading: studentsLoading } = useStudents(subjectId || null);
  const [date, setDate] = React.useState(Date.now());
  const { records, loading, getStatus, save, quickToggle } = useAttendance(subjectId || null, date);

  const handleSaveAll = async () => {
    const dayStart = getStartOfDay(date);
    const newRecords: AttendanceRecord[] = students.map(s => ({ subjectId: subjectId!, studentId: s.id, date: dayStart, status: getStatus(s.id), notes: '', createdAt: Date.now(), updatedAt: Date.now() }));
    await save(newRecords);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
          <Box sx={{ flexGrow: 1 }}><Typography variant="h4" fontWeight={700}>Asistencia</Typography><Typography color="text.secondary">{formatDate(date)}</Typography></Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <IconButton onClick={() => setDate(d => new Date(d).setDate(new Date(d).getDate() - 1))}><ChevronLeft /></IconButton>
            <DatePicker value={date} onChange={setDate} slotProps={{ textField: { size: 'small' } }} />
            <IconButton onClick={() => setDate(Date.now())}><Today fontSize="small" /></IconButton>
            <IconButton onClick={() => setDate(d => new Date(d).setDate(new Date(d).getDate() + 1))}><ChevronRight /></IconButton>
          </Box>
        </Box>

        {studentsLoading || loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box> : students.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}><CardContent><CalendarMonth sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} /><Typography variant="h5" gutterBottom>No hay alumnos</Typography><Typography color="text.secondary" paragraph>Ve a Alumnos para añadir</Typography></CardContent></Card>
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              {Object.entries(ATTENDANCE_STATUS).map(([key, val]) => (
                <Chip key={key} label={val.label} icon={<StatusIcon status={key as AttendanceRecord['status']} />} color={val.color as any} variant="outlined" size="small" />
              ))}
            </Box>
            <Grid container spacing={2}>
              {students.map(student => {
                const status = getStatus(student.id);
                const info = ATTENDANCE_STATUS[status];
                return (
                  <Grid item xs={12} sm={6} lg={4} key={student.id}>
                    <Card sx={{ cursor: 'pointer', transition: 'all 0.2s', borderLeft: `4px solid ${info.color}`, '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }} onClick={() => quickToggle(student.id)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box><Typography variant="subtitle1" fontWeight={600}>{student.firstName} {student.lastName}</Typography>{student.studentNumber && <Typography variant="caption" color="text.secondary">Nº {student.studentNumber}</Typography>}</Box>
                          <Chip label={info.label} icon={<StatusIcon status={status} />} color={info.color as any} size="small" />
                        </Box>
                        <RadioGroup value={status} onChange={e => save(student.id, e.target.value as AttendanceRecord['status'])} row sx={{ gap: 0.5 }}>
                          {Object.entries(ATTENDANCE_STATUS).map(([k, v]) => (
                            <FormControlLabel key={k} value={k as AttendanceRecord['status']} control={<Radio size="small" color="primary" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1, bgcolor: `${v.color}15` }}><Typography variant="caption" fontWeight={600} color={v.color}>{v.label}</Typography></Box>} />
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" size="large" fullWidth onClick={handleSaveAll} disabled={studentsLoading || loading}>
            Guardar toda la asistencia
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

function StatusIcon({ status }: { status: AttendanceRecord['status'] }) {
  return status === 'present' ? <CheckCircle fontSize="small" /> : status === 'absent' ? <Cancel fontSize="small" /> : status === 'late' ? <Schedule fontSize="small" /> : <DoNotDisturb fontSize="small" />;
}