import mongoose from 'mongoose'
import { APPLICATION_STATUS } from '../constants/constants.js'

const applicationSchema = new mongoose.Schema({
    createdAt: { 
      type: Date, default: Date.now 
    },
    status: { 
      type: String, enum: APPLICATION_STATUS, default: 'Pending' 
    },
    job: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'job', required: true 
    },
    student: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'student' 
    },
    alumni: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'alumni' 
    },
    name: { 
      type: String 
    },
    email: { 
      type: String 
    },
    contact: { 
      type: String 
    },
    resume: { 
      type: String 
    },
    reason: {
      type: String,
    },
  }, { validateBeforeSave: true, });

  const Application = mongoose.model('application', applicationSchema);

  export default Application;