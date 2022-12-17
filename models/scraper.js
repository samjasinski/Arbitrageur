const mongoose = require('mongoose');

const scraperSchema = new mongoose.Schema({
  targetPlatform: {
    type: String,
    required: true,
    maxLength: 50,
  },
  targetSport: {
    type: String,
    required: true,
    maxLength: 50,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  outcomesXpath: {
    type: String,
    required: true,
  },
  oddsXpath: {
    type: String,
    required: true,
  },
  groupBy: {
    type: Number,
    required: true,
  }

});

module.exports = scraperSchema;
