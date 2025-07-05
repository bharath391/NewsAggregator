const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: {
    type: String, 
    required: true, unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  notifications:{
    type:[String],
    default:[]
  },
  interests:{
    type:[String],
    default:[]
  },
  country: {
    type: String,
    default: 'in' 
  },
});

module.exports = mongoose.model('User', UserSchema);
