const mongoose = require('mongoose')

  const CarSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    imageSrc: String,
    imageAlt: String,
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  })
  module.exports = mongoose.model('Car', CarSchema)

