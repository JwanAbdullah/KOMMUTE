const mongoose = require('mongoose')

const busRequestSchema = new mongoose.Schema(
  {
    requester: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['Event', 'Exam', 'Club Activity'],
    },
    date: { type: String, required: true },
    departureTime: { type: String, required: true },
    returnTime: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    destination: { type: String, required: true },
    passengers: { type: Number, required: true, min: 1 },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('BusRequest', busRequestSchema)