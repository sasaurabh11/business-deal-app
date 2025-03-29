const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);