const Deal = require('../models/deal.model');

// @desc    Send a message in a deal
// @route   POST /api/chat/:dealId/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to send messages
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages' });
    }

    const message = {
      sender: req.user._id,
      content,
      isRead: false
    };

    deal.messages.push(message);
    await deal.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get messages for a deal
// @route   GET /api/chat/:dealId/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate('messages.sender', 'name email');

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to view messages
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    res.json(deal.messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:dealId/messages/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to mark messages as read
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark messages as read' });
    }

    // Mark all messages as read for the current user
    deal.messages.forEach(message => {
      if (message.sender.toString() !== req.user._id.toString()) {
        message.isRead = true;
      }
    });

    await deal.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/chat/:dealId/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to view unread count
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view unread count' });
    }

    const unreadCount = deal.messages.filter(
      message => !message.isRead && message.sender.toString() !== req.user._id.toString()
    ).length;

    res.json({ unreadCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCount
};
