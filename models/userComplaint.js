const mongoose = require('mongoose');

const userComplainSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    // unique: true
  },
  complaint: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    }
  }
});

// Create a 2dsphere index on the location field for geospatial queries
userComplainSchema.index({ location: '2dsphere' });

const userComplaint = mongoose.model('UserComplaint', userComplainSchema);

module.exports = { userComplaint };
