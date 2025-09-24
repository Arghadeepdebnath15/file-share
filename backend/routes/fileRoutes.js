const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const File = require('../models/File');
const RecentHistory = require('../models/RecentHistory');

// Configure multer for file upload to memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept all file types but verify file integrity
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar|txt|mp3|mp4|mov|avi|wav|psd|ai|eps/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not supported! Please upload a valid file.'));
    }
});

// Get recent files
router.get('/recent', async (req, res) => {
    try {
        const files = await File.find()
            .sort({ uploadDate: -1 })  // Sort by upload date, newest first
            .limit(10);                // Limit to 10 most recent files
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent files', error: error.message });
    }
});

// Get recent files for specific device
router.get('/recent/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log('Fetching recent files for device ID:', deviceId);
        
        let history = await RecentHistory.findOne({ deviceId }).populate('fileIds');
        console.log('Found history:', history);
        
        if (!history) {
            history = { fileIds: [] };
        }

        res.json(history.fileIds);
    } catch (error) {
        console.error('Error fetching recent files:', error);
        res.status(500).json({ message: 'Error fetching recent files', error: error.message });
    }
});

// Upload file and generate QR code
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Generate filename
        const ext = path.extname(req.file.originalname);
        const name = path.basename(req.file.originalname, ext);
        const filename = `${name}-${Date.now()}${ext}`;

        // Create GridFS bucket
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

        // Upload file to GridFS
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: { originalName: req.file.originalname, size: req.file.size }
        });

        uploadStream.write(req.file.buffer);
        uploadStream.end();

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        const baseUrl = 'https://file-share-fixed-5mkt1ymub-argha15203s-projects.vercel.app';
        const downloadUrl = `${baseUrl}/api/files/download/${filename}`;

        // Generate QR code
        const qrCode = await QRCode.toDataURL(downloadUrl);

        const file = new File({
            filename: filename,
            originalName: req.file.originalname,
            fileId: uploadStream.id,
            size: req.file.size,
            mimetype: req.file.mimetype,
            qrCode: qrCode
        });

        await file.save();

        // Add to device's recent history if deviceId is provided
        const deviceId = req.headers['device-id'];
        console.log('Upload request - Device ID:', deviceId);
        console.log('Upload request - File ID:', file._id);
        
        if (deviceId) {
            try {
                const result = await RecentHistory.findOneAndUpdate(
                    { deviceId },
                    { 
                        $push: { 
                            fileIds: { 
                                $each: [file._id],
                                $position: 0,
                                $slice: 10
                            }
                        }
                    },
                    { upsert: true, new: true }
                );
                console.log('RecentHistory updated:', result);
            } catch (error) {
                console.error('Error updating RecentHistory:', error);
            }
        } else {
            console.log('No device ID provided in upload request');
        }

        res.status(201).json({ file, qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
});

// Mobile upload page route
router.get('/upload-page', (req, res) => {
    // Get device ID from URL parameter if provided
    const deviceIdFromUrl = req.query.deviceId;
    
    // Send a simple HTML form for mobile uploads
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Upload File</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
            }
            .upload-container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
                color: #1976d2;
                text-align: center;
            }
            .file-input {
                margin: 20px 0;
                width: 100%;
            }
            .submit-btn {
                background-color: #1976d2;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
            }
            .submit-btn:hover {
                background-color: #1565c0;
            }
            .status {
                margin-top: 20px;
                text-align: center;
                color: #666;
            }
            .success-message {
                margin-top: 20px;
                padding: 15px;
                background-color: #e8f5e8;
                border: 1px solid #4caf50;
                border-radius: 4px;
                color: #2e7d32;
            }
            .error-message {
                margin-top: 20px;
                padding: 15px;
                background-color: #ffebee;
                border: 1px solid #f44336;
                border-radius: 4px;
                color: #c62828;
            }
        </style>
    </head>
    <body>
        <div class="upload-container">
            <h1>Upload File</h1>
            <form id="uploadForm" enctype="multipart/form-data">
                <input type="file" name="file" class="file-input" required>
                <button type="submit" class="submit-btn">Upload</button>
            </form>
            <div id="status" class="status"></div>
        </div>
        <script>
            // Get device ID from URL parameter or generate new one
            function getDeviceId() {
                const urlParams = new URLSearchParams(window.location.search);
                const deviceIdFromUrl = urlParams.get('deviceId');
                
                if (deviceIdFromUrl) {
                    // Use the device ID from URL parameter
                    return deviceIdFromUrl;
                } else {
                    // Fallback to localStorage or generate new one
                    let deviceId = localStorage.getItem('deviceId');
                    if (!deviceId) {
                        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
                        localStorage.setItem('deviceId', deviceId);
                    }
                    return deviceId;
                }
            }

            document.getElementById('uploadForm').onsubmit = async (e) => {
                e.preventDefault();
                const status = document.getElementById('status');
                status.textContent = 'Uploading...';
                status.className = 'status';
                
                const formData = new FormData(e.target);
                const deviceId = getDeviceId();
                
                try {
                    const response = await fetch('/api/files/upload', {
                        method: 'POST',
                        headers: {
                            'device-id': deviceId
                        },
                        body: formData
                    });
                    const data = await response.json();
                    if (response.ok) {
                        status.innerHTML = '<div class="success-message">✅ File uploaded successfully!<br><small>This file will appear in your recent files on the main website.</small></div>';
                    } else {
                        throw new Error(data.message || 'Upload failed');
                    }
                } catch (error) {
                    status.innerHTML = '<div class="error-message">❌ Error: ' + error.message + '</div>';
                }
            };
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Download file
router.get('/download/:filename', async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Increment download count
        file.downloadCount += 1;
        await file.save();

        // Create GridFS bucket
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

        // Stream file from GridFS
        const downloadStream = bucket.openDownloadStream(file.fileId);

        res.set('Content-Type', file.mimetype);
        res.set('Content-Disposition', `attachment; filename="${file.originalName}"`);

        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Error downloading file', error: error.message });
    }
});

// Get file info
router.get('/info/:filename', async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Error getting file info', error: error.message });
    }
});

// Debug endpoint to check device IDs
router.get('/debug/device-ids', async (req, res) => {
  try {
    const histories = await RecentHistory.find().populate('fileIds');
    res.json({
      totalHistories: histories.length,
      histories: histories.map(h => ({
        deviceId: h.deviceId,
        fileCount: h.fileIds.length,
        lastAccessed: h.lastAccessed
      }))
    });
  } catch (error) {
    console.error('Error fetching device IDs:', error);
    res.status(500).json({ message: 'Error fetching device IDs', error: error.message });
  }
});

// Debug endpoint to check all files
router.get('/debug/all-files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json({
      totalFiles: files.length,
      files: files.map(f => ({
        _id: f._id,
        filename: f.filename,
        originalName: f.originalName,
        uploadDate: f.uploadDate,
        size: f.size
      }))
    });
  } catch (error) {
    console.error('Error fetching all files:', error);
    res.status(500).json({ message: 'Error fetching all files', error: error.message });
  }
});

// Get device-specific files
router.post('/device-files', async (req, res) => {
  try {
    const { fileIds } = req.body;
    
    if (!Array.isArray(fileIds)) {
      return res.status(400).json({ message: 'fileIds must be an array' });
    }

    const files = await File.find({
      '_id': { $in: fileIds }
    }).sort({ uploadDate: -1 });

    res.json(files);
  } catch (error) {
    console.error('Error fetching device files:', error);
    res.status(500).json({ message: 'Error fetching device files' });
  }
});

// Clear recent history for a device
router.post('/clear-recent-history', async (req, res) => {
    try {
        const { deviceId } = req.body;
        await RecentHistory.findOneAndDelete({ deviceId });
        res.json({ message: 'Recent history cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing recent history', error: error.message });
    }
});

// Add file to device's recent history
router.post('/add-to-recent/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { fileId } = req.body;

        let history = await RecentHistory.findOne({ deviceId });
        
        if (!history) {
            history = new RecentHistory({
                deviceId,
                fileIds: [fileId]
            });
        } else {
            // Keep only the 10 most recent files
            if (!history.fileIds.includes(fileId)) {
                history.fileIds.unshift(fileId);
                if (history.fileIds.length > 10) {
                    history.fileIds = history.fileIds.slice(0, 10);
                }
            }
        }

        await history.save();
        res.json({ message: 'File added to recent history' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating recent history', error: error.message });
    }
});

module.exports = router; 