const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: [8, 'Passwords must be at least 8 charaacters long'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
