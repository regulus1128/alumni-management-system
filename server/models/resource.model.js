import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    type: {
      type: String,
      enum: ["syllabus", "notes", "question paper", "others"],
      required: true,
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    uploadedBy: {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, refPath: "uploadedBy.role" 
      },
      role: { 
        type: String, 
        enum: ["student", "alumni"], 
        required: true 
      },
    },
  }, { timestamps: true });

const Resource = mongoose.model('resource', resourceSchema);
export default Resource;
  