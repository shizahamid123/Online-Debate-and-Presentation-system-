const express = require('express');
const router = express.Router();
const { getAllDebates, createDebate, getDebateById, joinDebate, voteDebate, commentDebate } = require('../controllers/debateController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllDebates);
router.post('/', protect, createDebate);
router.get('/:id', protect, getDebateById);
router.post('/:id/join', protect, joinDebate);
router.post('/:id/vote', protect, voteDebate);
router.post('/:id/comments', protect, commentDebate);

module.exports = router;
