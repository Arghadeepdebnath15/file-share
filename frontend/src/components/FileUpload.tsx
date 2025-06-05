import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QRCode from 'react-qr-code';
import axios from 'axios';

// Get the local IP address or use localhost as fallback
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        },
      });
      setQrCode(response.data.qrCode);
      setDownloadUrl(`${BASE_URL}/api/files/download/${response.data.file.filename}`);
      setShowQR(true);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Error uploading file. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card
        sx={{
          mt: 2,
          p: 2,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : alpha('#2962ff', 0.2),
          backgroundColor: isDragging ? alpha('#2962ff', 0.05) : '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: alpha('#2962ff', 0.05),
            transform: 'translateY(-2px)',
          },
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent 
          sx={{ 
            textAlign: 'center',
            minHeight: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <CloudUploadIcon 
            sx={{ 
              fontSize: 80, 
              color: isDragging ? 'primary.main' : 'primary.light',
              mb: 3,
              transition: 'all 0.3s ease',
            }} 
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to select a file
          </Typography>
          {file && (
            <Box 
              sx={{ 
                mt: 2,
                p: 2,
                bgcolor: alpha('#2962ff', 0.05),
                borderRadius: 2,
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <Typography variant="body1" color="primary" sx={{ fontWeight: 500 }}>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Size: {formatFileSize(file.size)}
              </Typography>
            </Box>
          )}
          {loading && (
            <Box sx={{ mt: 3, width: '100%', maxWidth: '400px' }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#2962ff', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundImage: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {file && !loading && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
            sx={{
              minWidth: 200,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1e4cff 30%, #6b3dff 90%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload File'}
          </Button>
        </Box>
      )}

      <Dialog 
        open={showQR} 
        onClose={() => setShowQR(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          Scan QR Code to Download
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          {qrCode && (
            <Box sx={{ mt: 2 }}>
              <Box 
                sx={{ 
                  p: 4, 
                  bgcolor: 'white',
                  borderRadius: '16px',
                  display: 'inline-block',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <QRCode value={downloadUrl} size={256} />
              </Box>
              <Typography variant="body1" sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
                Scan this QR code to download the file
              </Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  mt: 1,
                  p: 2,
                  bgcolor: alpha('#2962ff', 0.05),
                  borderRadius: 2,
                  display: 'inline-block',
                }}
              >
                {downloadUrl}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUpload; 