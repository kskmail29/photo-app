const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const authenticate = require('./authMiddleware'); // Authentication middleware
const Photo = require('./Photo'); // Import the Photo model

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Set up Multer for file uploads (store in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route for testing
app.get('/', (req, res) => {
  res.send('Hello Family! Your Photos App is up and running!');
});

// Protected photo upload route
app.post('/upload', authenticate, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const photoData = new Photo({
    originalName: req.file.originalname,
    buffer: req.file.buffer,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadDate: new Date(),
  });

  try {
    await photoData.save(); // Save photo data to MongoDB
    res.status(200).json({ message: 'Photo uploaded successfully', photoData });
  } catch (error) {
    res.status(500).json({ message: 'Error saving photo to database', error });
  }
});

// Protected route to get all uploaded photos
app.get('/photos', authenticate, async (req, res) => {
  try {
    const photos = await Photo.find(); // Fetch all photos from MongoDB
    res.status(200).json(photos); // Return the photos as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving photos', error });
  }
});

// Protected route - requires authentication
app.get('/protected', authenticate, (req, res) => {
  res.send('This is a protected route. Only family can see this!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

