'use strict'
const  mongoose  = require('mongoose')

const  noteShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
})

noteShema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})

module.exports = mongoose.model('Note', noteShema)
