import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    forum: { type: mongoose.Schema.Types.ObjectId, ref: 'forum', required: true },
    alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'alumni' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'likedBy.role'
        },
        role: {
          type: String,
          required: true,
          enum: ['alumni', 'student']
        }
      }
    ],
  }, { timestamps: true });


  const Comment = mongoose.model('comment', commentSchema);

  export default Comment;
