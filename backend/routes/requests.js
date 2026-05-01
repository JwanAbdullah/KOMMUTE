const express = require('express')
const router = express.Router()
const { createRequest, getRequests, getMyRequests, updateRequestStatus } = require('../controllers/requestController')
const { protect, restrictTo } = require('../middleware/auth')

router.post('/', protect, restrictTo('faculty', 'club'), createRequest)
router.get('/', protect, restrictTo('admin'), getRequests)
router.get('/mine', protect, getMyRequests)
router.patch('/:id/status', protect, restrictTo('admin'), updateRequestStatus)

module.exports = router