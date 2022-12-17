const mongoose = require('mongoose');
const scraperSchema = require('./scraper');
const platformSchema = require('./platform');

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  scrapers: [scraperSchema],
  data: [platformSchema]
});

module.exports = userSchema;
