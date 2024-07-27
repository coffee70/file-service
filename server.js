const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const corsOptions = {
    origin: process.env.MANAGER_URL,
    optionsSuccessStatus: 200
}

const app = express();
const PORT = process.env.PORT || 9000;

const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(_req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`;
    res.json({ filename: req.file.originalname, url: fileUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});