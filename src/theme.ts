import { createTheme, PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#6200EE', light: '#BB86FC', dark: '#3700B3' },
      secondary: { main: '#018786', light: '#03DAC6', dark: '#006064' },
      error: { main: '#B00020' },
      success: { main: '#4CAF50' },
      warning: { main: '#FF9800' },
      info: { main: '#2196F3' },
      background: { default: mode === 'dark' ? '#121212' : '#F5F5F5', paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 12 },
    shadows: Array(25).fill('none') as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 16px' },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid', borderColor: 'divider' }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' }
        }
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' }
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: { borderRadius: 8, margin: '4px 8px' }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 }
        }
      }
    }
  });

export const theme = getTheme('light');