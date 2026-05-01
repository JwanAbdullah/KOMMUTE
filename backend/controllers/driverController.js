const Driver = require('../models/Driver')

async function getDrivers(req, res) {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 })
    res.json(drivers)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drivers' })
  }
}

async function createDriver(req, res) {
  const { driverId, name, assignedRoute, status, phone } = req.body

  if (!driverId || !name || !assignedRoute || !phone) {
    return res.status(400).json({ error: 'driverId, name, assignedRoute, and phone are required' })
  }

  try {
    const driver = await Driver.create({ driverId, name, assignedRoute, status, phone })
    res.status(201).json(driver)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Driver ID already exists' })
    res.status(500).json({ error: 'Failed to create driver' })
  }
}

async function updateDriver(req, res) {
  const { name, assignedRoute, status, phone } = req.body

  const validStatuses = ['Active', 'On Break', 'Delayed']
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { name, assignedRoute, status, phone },
      { new: true, runValidators: true }
    )
    if (!driver) return res.status(404).json({ error: 'Driver not found' })
    res.json(driver)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update driver' })
  }
}

async function deleteDriver(req, res) {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id)
    if (!driver) return res.status(404).json({ error: 'Driver not found' })
    res.json({ message: 'Driver deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete driver' })
  }
}

module.exports = { getDrivers, createDriver, updateDriver, deleteDriver }