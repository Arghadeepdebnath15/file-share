import React from 'react';
import { Box, Card, CardContent, Typography, alpha, Paper, Zoom } from '@mui/material';
import QRCode from 'react-qr-code';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadQRCode: React.FC = () => {
  // Get the base URL for the upload page
  const uploadUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/files/upload-page'
    : `http://${window.location.hostname}:5000/api/files/upload-page`;

  return (
    <Zoom in={true}>
      <Card 
        sx={{ 
          mt: 4, 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'visible',
          position: 'relative',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(41, 98, 255, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 4px 20px rgba(41, 98, 255, 0.15)',
              },
              '50%': {
                boxShadow: '0 4px 30px rgba(124, 77, 255, 0.3)',
              },
              '100%': {
                boxShadow: '0 4px 20px rgba(41, 98, 255, 0.15)',
              },
            },
          }}
        >
          <PhoneIphoneIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>

        <CardContent sx={{ textAlign: 'center', pt: 5 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quick Upload QR Code
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 4,
              gap: 1,
            }}
          >
            {[
              { icon: <PhoneIphoneIcon />, label: 'Scan' },
              { icon: <CloudUploadIcon />, label: 'Upload' },
              { icon: <ArrowUpwardIcon />, label: 'Done' }
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                {index > 0 && (
                  <Box 
                    sx={{ 
                      height: 2, 
                      width: 40, 
                      bgcolor: 'primary.main',
                      opacity: 0.3,
                    }} 
                  />
                )}
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#2962ff', 0.05),
                    border: '1px solid',
                    borderColor: alpha('#2962ff', 0.1),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#2962ff', 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      color: 'primary.main',
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {step.label}
                  </Typography>
                </Paper>
              </React.Fragment>
            ))}
          </Box>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              maxWidth: 400, 
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Scan this QR code with your phone to quickly upload files from your mobile device
          </Typography>

          <Box 
            sx={{ 
              display: 'inline-block',
              p: 4,
              bgcolor: 'white',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mb: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(45deg, #2962ff 30%, #7c4dff 90%)',
                borderRadius: '26px',
                zIndex: -1,
                opacity: 0.5,
              },
            }}
          >
            <QRCode 
              value={uploadUrl} 
              size={256}
              level="H"
            />
          </Box>

          <Typography 
            variant="body2" 
            color="primary"
            sx={{
              p: 2,
              bgcolor: alpha('#2962ff', 0.05),
              borderRadius: 2,
              display: 'inline-block',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'monospace',
              border: '1px dashed',
              borderColor: alpha('#2962ff', 0.2),
            }}
          >
            {uploadUrl}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default UploadQRCode; 