import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

interface DeviceManagerProps {
  onClearHistory: () => void;
  onRefresh: () => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onClearHistory, onRefresh }) => {
  const [open, setOpen] = React.useState(false);
  const [deviceFiles] = React.useState(() => {
    return JSON.parse(localStorage.getItem('deviceFiles') || '[]');
  });

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your device history? This will remove all file references from this device.')) {
      localStorage.removeItem('deviceFiles');
      onClearHistory();
      setOpen(false);
    }
  };

  return (
    <>
      <Tooltip title="Device Settings">
        <IconButton 
          onClick={() => setOpen(true)}
          sx={{ 
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Device Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Statistics
            </Typography>
            <Typography variant="body1">
              Files tracked on this device: {deviceFiles.length}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Management
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearHistory}
              sx={{ mr: 2 }}
            >
              Clear Device History
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceManager; 