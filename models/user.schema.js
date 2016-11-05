const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '{PATH} is required!'],
  },
  mail: {
    type: String,
    required: [true, '{PATH} is required!'],
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, '{PATH} is required!'],
  },
  role: {
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, SALT_WORK_FACTOR, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;

    next();
  });
});

module.exports = mongoose.model('User', userSchema);
