const BusRequest = require('../models/BusRequest')

async function createRequest(req, res) {
  const { requester, type, date, departureTime, returnTime, pickupLocation, destination, passengers, notes } = req.body

  if (!requester || !type || !date || !departureTime || !returnTime || !pickupLocation || !destination || !passengers) {
    return res.status(400).json({ error: 'All fields are required except notes' })
  }

  const validTypes = ['Event', 'Exam', 'Club Activity']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid request type' })
  }

  if (passengers < 1) {
    return res.status(400).json({ error: 'Passengers must be at least 1' })
  }

  try {
    const request = await BusRequest.create({
      requester,
      type,
      date,
      departureTime,
      returnTime,
      pickupLocation,
      destination,
      passengers,
      notes,
      submittedBy: req.user?._id,
    })
    res.status(201).json(request)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create request' })
  }
}

async function getRequests(req, res) {
  try {
    const requests = await BusRequest.find().sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
}

async function getMyRequests(req, res) {
  try {
    const requests = await BusRequest.find({ submittedBy: req.user._id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your requests' })
  }
}

async function updateRequestStatus(req, res) {
  const { status } = req.body
  const validStatuses = ['Pending', 'Approved', 'Rejected']

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status must be Pending, Approved, or Rejected' })
  }

  try {
    const request = await BusRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!request) return res.status(404).json({ error: 'Request not found' })
    res.json(request)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' })
  }
}

module.exports = { createRequest, getRequests, getMyRequests, updateRequestStatus }