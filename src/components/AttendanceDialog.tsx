import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography, FormControlLabel, Radio, RadioGroup, TextField, IconButton } from '@mui/material';
import { CalendarMonth, ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { AttendanceRecord } from '../types';
import { ATTENDANCE_STATUS } from '../types';
import { getStartOfDay, formatDate } from '../services';
import { useAttendance } from '../hooks';

interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  subjectId: string;
  students: { id: string; firstName: string; lastName: string; studentNumber: string }[];
  initialRecords: AttendanceRecord[];
  onSave: (records: AttendanceRecord[]) => void;
  loading?: boolean;
}

export function AttendanceDialog({ open, onClose, subjectId, students, initialRecords, onSave, loading }: AttendanceDialogProps) {
  const [date, setDate] = React.useState(Date.now());
  const [statuses, setStatuses] = React.useState<Record<string, AttendanceRecord['status']>>({});
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const { getStatus } = useAttendance(subjectId, date);

  React.useEffect(() => {
    const initial: Record<string, AttendanceRecord['status']> = {};
    const initialNotes: Record<string, string> = {};
    initialRecords.forEach(r => {
      initial[r.studentId] = r.status;
      initialNotes[r.studentId] = r.notes;
    });
    students.forEach(s => {
      if (!initial[s.id]) initial[s.id] = getStatus(s.id);
    });
    setStatuses(initial);
    setNotes(initialNotes);
  }, [initialRecords, students, getStatus]);

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const dayStart = getStartOfDay(date);
    const records: AttendanceRecord[] = students.map(s => ({
      id: initialRecords.find(r => r.studentId === s.id)?.id,
      subjectId,
      studentId: s.id,
      date: dayStart,
      status: statuses[s.id] || 'present',
      notes: notes[s.id] || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
    onSave(records);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography>Asistencia - {formatDate(date)}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setDate(d => new Date(d).setDate(new Date(d).getDate() - 1))}><ChevronLeft /></IconButton>
              <DatePicker value={date} onChange={setDate} slotProps={{ textField: { size: 'small' } }} />
              <IconButton onClick={() => setDate(Date.now())}><Today fontSize="small" /></IconButton>
              <IconButton onClick={() => setDate(d => new Date(d).setDate(new Date(d).getDate() + 1))}><ChevronRight /></IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Grid container spacing={1}>
            {students.map(s => (
              <Grid item xs={12} sm={6} key={s.id}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bg: 'background.paper' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {s.firstName} {s.lastName}
                    </Typography>
                    {s.studentNumber && <Typography variant="caption" color="text.secondary">Nº {s.studentNumber}</Typography>}
                  </Box>
                  <RadioGroup
                    value={statuses[s.id] || 'present'}
                    onChange={e => handleStatusChange(s.id, e.target.value as AttendanceRecord['status'])}
                    row
                    sx={{ gap: 1 }}
                  >
                    {Object.entries(ATTENDANCE_STATUS).map(([key, val]) => (
                      <FormControlLabel
                        key={key}
                        value={key as AttendanceRecord['status']}
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1, bgcolor: `${val.color}15` }}>
                            <Typography variant="caption" fontWeight={600} color={val.color}>{val.label}</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </RadioGroup>
                  <TextField
                    size="small"
                    placeholder="Notas (opcional)"
                    value={notes[s.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                    sx={{ mt: 1, width: '100%' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Asistencia'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}