import messageModel from "../models/chat.model.js";

const sendMessage = async (req, res) => {
  try {
    const { dealId, receiverId, message } = req.body;

    const newMessage = await messageModel.create({
      dealId,
      sender: req.user.id,
      receiver: receiverId,
      message
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in sending message', error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { dealId } = req.params;
    const messages = await messageModel.find({ dealId });
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: 'Error in getting messages', error });
  }
};

const markRead = async (req, res) => {
  try {
    const { dealId } = req.body;
    await messageModel.updateMany({ dealId, receiver: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update messages', error });
  }
};


export { sendMessage, getMessages, markRead };