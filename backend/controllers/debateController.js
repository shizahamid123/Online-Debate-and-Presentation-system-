const Debate = require('../models/Debate');

exports.getAllDebates = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.category) query.category = new RegExp(req.query.category, 'i');
    if (req.query.difficulty) query.difficultyLevel = req.query.difficulty;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }
    const debates = await Debate.find(query)
      .populate('creator', 'username email fullName')
      .populate('comments.user', 'username fullName');
    res.json(debates);
  } catch (error) {
    next(error);
  }
};

exports.createDebate = async (req, res, next) => {
  try {
    const { title, description, category, difficultyLevel, maxParticipants, duration, startTime } = req.body;
    const debate = await Debate.create({
      title,
      description,
      category,
      difficultyLevel,
      maxParticipants: maxParticipants || 8,
      duration: duration || 30,
      startTime: startTime ? new Date(startTime) : undefined,
      creator: req.user._id,
      participants: [req.user._id],
    });
    res.status(201).json(debate);
  } catch (error) {
    next(error);
  }
};

exports.getDebateById = async (req, res, next) => {
  try {
    const debate = await Debate.findById(req.params.id)
      .populate('creator', 'username fullName')
      .populate('comments.user', 'username fullName');
    if (!debate) {
      res.status(404);
      throw new Error('Debate not found');
    }

    const voteValues = debate.votes ? Array.from(debate.votes.values()) : [];
    const upvotes = voteValues.filter(v => v === 'up').length;
    const downvotes = voteValues.filter(v => v === 'down').length;

    res.json({
      ...debate.toObject(),
      upvotes,
      downvotes,
      comments: debate.comments || [],
    });
  } catch (error) {
    next(error);
  }
};

exports.joinDebate = async (req, res, next) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      res.status(404);
      throw new Error('Debate not found');
    }
    if (debate.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined' });
    }
    if (debate.participants.length >= debate.maxParticipants) {
      return res.status(400).json({ message: 'Debate is full' });
    }
    debate.participants.push(req.user._id);
    await debate.save();
    res.json({ message: 'Joined debate successfully', debate });
  } catch (error) {
    next(error);
  }
};

exports.voteDebate = async (req, res, next) => {
  try {
    const { type } = req.body;
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      res.status(404);
      throw new Error('Debate not found');
    }
    if (!['up', 'down'].includes(type)) {
      res.status(400);
      throw new Error('Vote type must be up or down');
    }

    debate.votes.set(req.user._id.toString(), type);
    await debate.save();

    const voteValues = Array.from(debate.votes.values());
    const upvotes = voteValues.filter(v => v === 'up').length;
    const downvotes = voteValues.filter(v => v === 'down').length;

    res.json({ message: 'Vote recorded', upvotes, downvotes });
  } catch (error) {
    next(error);
  }
};

exports.commentDebate = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400);
      throw new Error('Comment content is required');
    }
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      res.status(404);
      throw new Error('Debate not found');
    }
    debate.comments.push({ user: req.user._id, content: content.trim() });
    await debate.save();
    await debate.populate('comments.user', 'username fullName');
    res.status(201).json({ message: 'Comment added', comments: debate.comments });
  } catch (error) {
    next(error);
  }
};
