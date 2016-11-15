const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

/**
 * Mongoose model for a user
 *
 * @typedef {model} User
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '{PATH} is required!'],
    match: [
      /^([a-zA-ZàáÀÁèéÈÉíÍòóÒÓúÚüÜïÏñÑçÇ]{2,}\s?){1,5}$/, // spanish names
      `The name has to be at least 2 characters long and can only contain letters, spaces and a 
      maximum of five words`,
    ],
  },
  mail: {
    type: String,
    required: [true, '{PATH} is required!'],
    index: true,
    unique: true,
    validate: [
      val => isEmail(val),
      '{VALUE} is not an accepted {PATH} address!',
    ],
  },
  password: {
    type: String,
    required: [true, '{PATH} is required!'],
    minlength: [8, '{PATH} is shorter than the minimum allowed length ({MINLENGTH})'],
  },
  role: {
    type: Number,
  },
}, {
  toObject: {
    transform: (doc, ret) => {
      const obj = Object.assign({}, ret, { id: doc._id });

      delete obj._id;
      delete obj.__v;
      delete obj.role;
      delete obj.password;

      return obj;
    },
  },
});

userSchema.pre('save', function userPreSave(next) {
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
