import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { API_URL } from '../config';

interface FileInfo {
  _id: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  downloadCount: number;
  uploadDate: string;
  qrCode: string;
}

const RecentFiles: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/files/recent`);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load recent files');
      console.error('Error fetching recent files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
    // Refresh the list every 30 seconds
    const interval = setInterval(fetchRecentFiles, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDownload = (filename: string, originalName: string) => {
    window.open(`${API_URL}/api/files/download/${filename}`, '_blank');
  };

  const handleShowQR = (file: FileInfo) => {
    setSelectedFile(file);
    setShowQRDialog(true);
  };

  if (loading) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography>Loading recent files...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Uploads
          </Typography>
          {files.length === 0 ? (
            <Typography color="text.secondary">No files uploaded yet</Typography>
          ) : (
            <List>
              {files.map((file, index) => (
                <React.Fragment key={file._id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={file.originalName}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            size="small"
                            label={formatFileSize(file.size)}
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            size="small"
                            icon={<FileDownloadIcon />}
                            label={`${file.downloadCount} downloads`}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Uploaded: {formatDate(file.uploadDate)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ mt: { xs: 2, sm: 0 }, ml: { xs: 0, sm: 2 }, display: 'flex' }}>
                      <IconButton
                        onClick={() => handleShowQR(file)}
                        color="primary"
                        title="Show QR Code"
                        sx={{ mr: 1 }}
                      >
                        <QrCodeIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDownload(file.filename, file.originalName)}
                        color="primary"
                        title="Download file"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scan QR Code to Download</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
          {selectedFile && (
            <Box sx={{ mt: 2 }}>
              <QRCode 
                value={`${API_URL}/api/files/download/${selectedFile.filename}`} 
                size={256} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Scan this QR code to download {selectedFile.originalName}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecentFiles; 