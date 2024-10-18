// Photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  buffer: { type: Buffer, required: true }, // Store the file buffer
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;

