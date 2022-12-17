const mongoose = require('mongoose');
const sportSchema = require('./sport');

const platfromSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  sports: [sportSchema]
});

module.exports = platfromSchema;
