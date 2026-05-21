const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
