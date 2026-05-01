const express = require('express')
const router = express.Router()
const { getAllRoutes, getRouteById } = require('../controllers/routeController')

router.get('/', getAllRoutes)
router.get('/:id', getRouteById)

module.exports = router