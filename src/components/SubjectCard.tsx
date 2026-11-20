import React from 'react';
import { Card, CardContent, Box, Typography, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Edit, Delete, Visibility, People, CheckCircle, Psychology } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
        borderLeft: `4px solid ${subject.color}`
      }}
      onClick={() => navigate(`/subject/${subject.id}/students`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: subject.color }}>
              {subject.name}
            </Typography>
            {subject.code && (
              <Typography variant="body2" color="text.secondary">
                {subject.code}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <Visibility />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <Chip
            icon={<People fontSize="small" />}
            label={`${subject.studentIds.length} alumnos`}
            size="small"
            variant="outlined"
            sx={{ height: 28 }}
          />
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Asistencia"
            size="small"
            variant="outlined"
            color="success"
            sx={{ height: 28 }}
          />
          <Chip
            icon={<Psychology fontSize="small" />}
            label="Conducta"
            size="small"
            variant="outlined"
            color="warning"
            sx={{ height: 28 }}
          />
        </Box>
      </CardContent>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/subject/${subject.id}/students`); }}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          <ListItemText primary="Ver alumnos" />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onEdit(subject); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); onDelete(subject.id); }}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </Menu>
    </Card>
  );
}