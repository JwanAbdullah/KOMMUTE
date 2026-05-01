const mongoose = require('mongoose')

const delaySchema = new mongoose.Schema(
  {
    route: { type: String, required: true },
    stop: { type: String, required: true },
    delayMinutes: {
      type: Number,
      required: true,
      min: [1, 'Delay must be at least 1 minute'],
    },
    reason: { type: String, required: true },
    additionalNotes: { type: String, default: '' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Delay', delaySchema)