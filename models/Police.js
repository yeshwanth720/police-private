const mongoose = require('mongoose');

// Define the schema for police officers
const PoliceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  occupied:{
  type:Boolean,
  default:false
  },
  password: {
    type: String,
    required: true,
  },
  isLoggedin:{
    type:Boolean,
    default:false
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
PoliceSchema.index({ location: '2dsphere' });

// Create the model from the schema
const Police = mongoose.model('Police', PoliceSchema);

module.exports = Police;
