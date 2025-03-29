const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  dealId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Deal', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false
   }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
