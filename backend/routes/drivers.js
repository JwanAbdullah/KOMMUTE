const express = require('express')
const router = express.Router()
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController')
const auth = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

router.get('/', auth, roleGuard('admin'), getDrivers)
router.post('/', auth, roleGuard('admin'), createDriver)
router.patch('/:id', auth, roleGuard('admin'), updateDriver)
router.delete('/:id', auth, roleGuard('admin'), deleteDriver)

module.exports = router