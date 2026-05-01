const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    assignedRoute: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'On Break', 'Delayed'],
      default: 'Active',
    },
    phone: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Driver', driverSchema)