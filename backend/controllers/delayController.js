const Delay = require('../models/Delay')

async function reportDelay(req, res) {
  const { route, stop, delayMinutes, reason, additionalNotes } = req.body

  if (!route || !stop || !delayMinutes || !reason) {
    return res.status(400).json({ error: 'route, stop, delayMinutes, and reason are required' })
  }

  if (isNaN(delayMinutes) || Number(delayMinutes) < 1) {
    return res.status(400).json({ error: 'delayMinutes must be a positive number' })
  }

  try {
    const delay = await Delay.create({
      route,
      stop,
      delayMinutes: Number(delayMinutes),
      reason,
      additionalNotes,
      submittedBy: req.user?._id,
    })
    res.status(201).json(delay)
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit delay report' })
  }
}

async function getDelays(req, res) {
  try {
    const delays = await Delay.find().sort({ createdAt: -1 })
    res.json(delays)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch delays' })
  }
}

module.exports = { reportDelay, getDelays }