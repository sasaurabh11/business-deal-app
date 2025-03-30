import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deal',
    required: true,
    index: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  docsUrl: {
    type: String,
    required: true,
  },
  accessUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }],
}, { timestamps: true });

const documentModel = mongoose.model.document || mongoose.model("document", documentSchema);
export default documentModel