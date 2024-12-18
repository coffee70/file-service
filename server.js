const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
    next();
});

const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(_req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Remove the static file serving line and replace with GET endpoint
app.get('/get/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${req.params.filename}`);
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Send file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error sending file: ${req.params.filename}`);
                return res.status(500).json({ error: 'Error sending file' });
            }
            console.log(`File sent: ${req.params.filename}`);
        });
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`;
    console.log(`File uploaded: ${req.file.originalname}`);
    res.json({ filename: req.file.originalname, url: fileUrl });
});

app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${req.params.filename}`);
            return res.status(500).json({ error: 'File not found or could not be deleted' });
        }
        console.log(`File deleted: ${req.params.filename}`);
        res.status(200).json({ message: 'File deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});