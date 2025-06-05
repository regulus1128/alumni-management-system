import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'members.role' },
        role: { type: String, enum: ['student', 'alumni'], required: true }
      }
    ]
  }, { timestamps: true });

const Conversation = mongoose.model('conversation', conversationSchema);
export default Conversation;