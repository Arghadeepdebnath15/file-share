const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileRoutes = require('../backend/routes/fileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.0.103:3000',
    'http://localhost:5000',
    'https://filetnf.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2023422375arghadeep:SjEckjBfyu8ECtBD@cluster0.y1rybwu.mongodb.net/qr-file-share?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/files', fileRoutes);

// Frontend is deployed separately on Netlify, so we don't serve static files

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
