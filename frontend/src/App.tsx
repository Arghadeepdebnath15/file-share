import React from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Divider,
  StyledEngineProvider,
  IconButton,
  useMediaQuery
} from '@mui/material';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import FileUpload from './components/FileUpload';
import UploadQRCode from './components/UploadQRCode';
import RecentFiles from './components/RecentFiles';
import Blog from './components/Blog';

// Add Poppins font
const poppinsFont = document.createElement('link');
poppinsFont.rel = 'stylesheet';
poppinsFont.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(poppinsFont);

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    localStorage.getItem('themeMode') as 'light' | 'dark' || (prefersDarkMode ? 'dark' : 'light')
  );
  const [tabValue, setTabValue] = React.useState(0);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
            default: mode === 'light' ? '#f5f7ff' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
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
      }),
    [mode]
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: mode === 'light' 
              ? 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)'
              : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
            py: 4,
            position: 'relative',
          }}
        >
          {/* Theme Toggle Button */}
          <IconButton
            onClick={toggleColorMode}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[4],
              width: 40,
              height: 40,
              transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
              '&:hover': {
                bgcolor: theme.palette.background.paper,
                transform: 'rotate(45deg)',
              },
            }}
          >
            {mode === 'dark' ? (
              <WbSunnyRoundedIcon 
                sx={{ 
                  color: '#ffd700',
                  fontSize: 24,
                  transition: 'color 0.3s ease-in-out',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }} 
              />
            ) : (
              <NightlightRoundIcon 
                sx={{ 
                  color: '#5c6bc0',
                  fontSize: 24,
                  transition: 'color 0.3s ease-in-out',
                  '&:hover': {
                    color: '#3f51b5',
                  },
                }} 
              />
            )}
          </IconButton>

          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(30,30,30,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid',
                borderColor: mode === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{
                    background: mode === 'light'
                      ? 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)'
                      : 'linear-gradient(45deg, #768fff 30%, #b47cff 90%)',
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
                    background: mode === 'light'
                      ? 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)'
                      : 'linear-gradient(45deg, #768fff 30%, #b47cff 90%)',
                  },
                }}
              >
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  centered
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: '120px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      '&.Mui-selected': {
                        color: mode === 'light' ? 'primary.main' : 'primary.light',
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

        <Divider sx={{ my: 6 }} />
        <Blog />

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
    </StyledEngineProvider>
  );
}

export default App;
