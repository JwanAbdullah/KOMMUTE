const Route = require('../models/Route')

async function getAllRoutes(req, res) {
  try {
    const routes = await Route.find()
    res.json(routes)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' })
  }
}

async function getRouteById(req, res) {
  try {
    const route = await Route.findOne({ id: req.params.id })
    if (!route) return res.status(404).json({ error: 'Route not found' })
    res.json(route)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' })
  }
}

module.exports = { getAllRoutes, getRouteById }