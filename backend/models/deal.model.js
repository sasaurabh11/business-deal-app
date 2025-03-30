import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'document',
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    accessControl: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      canView: {
        type: Boolean,
        default: false
      }
    }]
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  priceHistory: [{
    price: Number,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
}, { timestamps: true });


dealSchema.pre('save', function(next) {
  if (this.isModified('currentPrice')) {
    this.priceHistory.push({
      price: this.currentPrice,
      updatedBy: this.modifiedPaths().includes('currentPrice') ? this._doc.updatedBy : null
    });
  }
  next();
});

const dealModel = mongoose.model.deal || mongoose.model("deal", dealSchema);
export default dealModel;