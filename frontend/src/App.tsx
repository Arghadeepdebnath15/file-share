import React from 'react';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Tabs, 
  Tab, 
  Box,
  Paper
} from '@mui/material';
import FileUpload from './components/FileUpload';
import UploadQRCode from './components/UploadQRCode';
import RecentFiles from './components/RecentFiles';
import { Typography } from '@mui/material';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2962ff',
      light: '#768fff',
      dark: '#0039cb',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
    },
    background: {
      default: '#f5f7ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
        },
      },
    },
  },
});

// Add Poppins font
const poppinsFont = document.createElement('link');
poppinsFont.rel = 'stylesheet';
poppinsFont.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(poppinsFont);

function App() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{
                  background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                QR File Share
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                color="text.secondary"
                sx={{ 
                  maxWidth: '600px', 
                  margin: '0 auto',
                  opacity: 0.8,
                }}
              >
                Share files securely with QR codes - Fast, Easy, and Reliable
              </Typography>
            </Box>

            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                mb: 4,
                '& .MuiTabs-indicator': {
                  height: '3px',
                  borderRadius: '3px',
                  background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
                },
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTab-root': {
                    minWidth: '160px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Tab label="Upload File" />
                <Tab label="Quick Upload QR" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
              {tabValue === 0 && (
                <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <FileUpload />
                  <RecentFiles />
                </Box>
              )}
              {tabValue === 1 && (
                <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <UploadQRCode />
                  <RecentFiles />
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default App;
