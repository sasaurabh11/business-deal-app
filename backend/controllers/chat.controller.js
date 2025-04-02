import messageModel from '../models/chat.model.js';

const sendMessage = async (req, res) => {
  try {
    const { dealId, receiverId, message } = req.body;

    if (!dealId || !receiverId || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required to send a message.' });
    }

    const newMessage = await messageModel.create({
      dealId,
      sender: req.user.id,
      receiver: receiverId,
      message,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send the message. Please try again later.', error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { dealId } = req.params;
    if (!dealId) {
      return res.status(400).json({ success: false, message: 'Deal ID is required to fetch messages.' });
    }
    
    const messages = await messageModel.find({ dealId }).sort({ createdAt: 1 });
    
    res.status(200).json({ success: true, message: 'Messages retrieved successfully!', data: messages });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch messages. Please try again later.', error });
  }
};

const markRead = async (req, res) => {
  try {
    const { dealId } = req.body;
    if (!dealId) {
      return res.status(400).json({ success: false, message: 'Deal ID is required to mark messages as read.' });
    }

    await messageModel.updateMany({ dealId, receiver: req.user.id }, { isRead: true });
    
    res.status(200).json({ success: true, message: 'Messages marked as read successfully!' });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ success: false, message: 'Could not update message status. Please try again.', error });
  }
};

export { sendMessage, getMessages, markRead };