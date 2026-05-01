const express = require('express')
const router = express.Router()
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/', protect, restrictTo('admin'), getDrivers)
router.post('/', protect, restrictTo('admin'), createDriver)
router.patch('/:id', protect, restrictTo('admin'), updateDriver)
router.delete('/:id', protect, restrictTo('admin'), deleteDriver)

module.exports = router