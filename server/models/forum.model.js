import mongoose from 'mongoose'

const forumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'alumni' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  }, { timestamps: true });


  const Forum = mongoose.model('forum', forumSchema);

  export default Forum;