const express = require('express')
const router = express.Router()
const { reportDelay, getDelays } = require('../controllers/delayController')
const { protect, restrictTo } = require('../middleware/auth')

router.post('/', protect, restrictTo('driver'), reportDelay)
router.get('/', protect, restrictTo('admin'), getDelays)

module.exports = router