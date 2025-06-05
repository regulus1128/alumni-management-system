import mongoose from 'mongoose'
import { JOB_TYPES } from '../constants/constants.js'

const jobSchema = new mongoose.Schema({
    jobRole: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: JOB_TYPES, required: true },
    salary: { type: Number, required: true },
    postedAt: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'alumni' },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'application' }],
  });

  
  const Job = mongoose.model('job', jobSchema);

  export default Job;