const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email'
      ]
    },
    hashedPassword: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: false,
      default: '1234567899'
    },
    passwordToken: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    roles: {
      type: String,
      default: 'Admin'
    },
    settings: {
      allowNewClient: {
        type: Boolean,
        default: 0
      },
      disabledBalanceOnAdd: {
        type: Boolean,
        default: 0
      },
      disabledBalanceOnEdit: {
        type: Boolean,
        default: 0
      }
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('User', UserSchema)
