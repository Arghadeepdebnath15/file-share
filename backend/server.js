const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://2023422375arghadeep:SjEckjBfyu8ECtBD@cluster0.y1rybwu.mongodb.net/qr-file-share?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 