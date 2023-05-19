const mongoose = require('mongoose')
const { Schema } = mongoose


// URLs Collection Schema
const urlSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
})

const Url = mongoose.model('Url', urlSchema)

// Category Collection Schema
const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  urls: {
    type: [Schema.Types.ObjectId],
    ref: 'Url',
  }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = { Url, Category }
