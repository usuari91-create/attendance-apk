import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, useMediaQuery, useTheme, Divider, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Logout, School, Psychology, CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Mis Clases', icon: <School /> },
    { path: '/attendance', label: 'Asistencia', icon: <CheckCircle /> },
    { path: '/behavior', label: 'Comportamiento', icon: <Psychology /> }
  ];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { handleMenuClose(); logout(); };

  if (isMobile) {
    return (
      <>
        <AppBar position="fixed" elevation={2} sx={{ zIndex: 1200 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} aria-label="menu"><MenuIcon /></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>Lista de Clase</Typography>
            {user && <Tooltip title={user.isAnonymous ? 'Invitado' : user.email || 'Usuario'}><IconButton onClick={handleMenuOpen}><Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText' }}>{user.displayName?.[0] || user.email?.[0] || 'U'}</Avatar></IconButton></Tooltip>}
          </Toolbar>
        </AppBar>
        <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)} ModalProps={{ keepMounted: true }} sx={{ drawer: { width: 280 }, paper: { width: 280, boxSizing: 'border-box' } }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}><Typography variant="h6" fontWeight={600}>Menú</Typography></Box>
          <List>{navItems.map(item => <ListItem button key={item.path} selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))} onClick={() => { navigate(item.path); setDrawerOpen(false); }} sx={{ borderRadius: 0, mx: 1, my: 0.5 }}><ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} /></ListItem>)}</List>
          <Divider /><List><ListItem button onClick={handleLogout}><ListItemIcon><Logout /></ListItemIcon><ListItemText primary="Cerrar sesión" /></ListItem></List>
        </Drawer>
        <Box component="main" sx={{ pt: '64px', minHeight: '100vh', pb: 4 }}>{children}</Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { md: `calc(100% - 280px)` }, zIndex: 1100, ml: { md: '280px' } }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>Lista de Clase</Typography>
          {user && <Tooltip title={user.isAnonymous ? 'Invitado' : user.email || 'Usuario'}><IconButton onClick={handleMenuOpen}><Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText' }}>{user.displayName?.[0] || user.email?.[0] || 'U'}</Avatar></IconButton></Tooltip>}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ drawer: { width: 280, flexShrink: 0 }, paper: { width: 280, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider', height: '100vh', position: 'sticky', top: 0 } }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}><Typography variant="h6" fontWeight={600}>Lista de Clase</Typography></Box>
        <List>{navItems.map(item => <ListItem button key={item.path} selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))} onClick={() => navigate(item.path)} sx={{ borderRadius: 0, mx: 1, my: 0.5 }}><ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} /></ListItem>)}</List>
        <Divider /><Box sx={{ p: 2 }}><Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Usuario: {user?.isAnonymous ? 'Invitado' : user?.email || 'Anónimo'}</Typography><ListItem button onClick={handleLogout} sx={{ px: 0 }}><ListItemIcon><Logout /></ListItemIcon><ListItemText primary="Cerrar sesión" /></ListItem></Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', ml: { md: '280px' }, minHeight: '100vh' }}>{children}</Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}><MenuItem onClick={handleLogout}><Logout fontSize="small" /> Cerrar sesión</MenuItem></Menu>
    </Box>
  };