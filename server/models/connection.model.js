import mongoose from 'mongoose'
import { CONNECTION_STATUS } from '../constants/constants.js';

const connectionSchema = new mongoose.Schema({
    status: { type: String, enum: CONNECTION_STATUS, default: 'pending' },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'alumni', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    connectedById: { type: mongoose.Schema.Types.ObjectId, ref: 'alumni' },
  }, { timestamps: true });

  
  const Connection = mongoose.model('connection', connectionSchema);

  export default Connection;