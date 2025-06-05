import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Conversation'
    },
    sender: {
      user: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'sender.role' },
      role: { type: String, enum: ['student', 'alumni'], required: true }
    },
    text: {
      type: String,
      required: true
    },
  }, { timestamps: true });

const Message = mongoose.model('message', messageSchema);
export default Message;
  