const mongoose = require('mongoose')

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  served: { type: String, required: true },
})

const tripSchema = new mongoose.Schema({
  depart: { type: String, required: true },
  return: { type: String, required: true },
})

const routeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  frequency: { type: String },
  frequencyMinutes: { type: Number },
  startTime: { type: String },
  endTime: { type: String },
  timing: { type: String },
  eta: { type: String },
  stops: [stopSchema],
  trips: [tripSchema],
})

module.exports = mongoose.model('Route', routeSchema)