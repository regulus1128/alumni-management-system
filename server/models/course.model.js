import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", // assuming admin model exists
    },
}, { timestamps: true });

const Course = mongoose.model('course', courseSchema);
export default Course;
