const mongoose = require('mongoose')

const HashtagSchema = new mongoose.Schema(
  {
    categoryId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'categories'
    },
    subcategoryName: {
      type: String,
      required: true,
      unique: true
    },
    hashtags: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('hashtags', HashtagSchema)
