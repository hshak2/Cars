const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true,
  },
    carImage: {
    type: String,
    required: true,
  },
    carDesc: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  }
})

module.exports = mongoose.model('Car', TodoSchema)