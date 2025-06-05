import mongoose from 'mongoose'
import { GENDERS } from '../constants/constants.js'

const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 2, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    gender: { 
        type: String, 
        enum: GENDERS, 
        required: true 
    },
    dept: { 
        type: String, 
        required: true 
    },
    pursuing: { 
        type: String, 
        required: true 
    },
    batch: { 
        type: Number, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    avatar: String,
    verified: { 
        type: Boolean, 
        default: false 
    },
    verificationCode: { 
        type: String 
    },
    verificationCodeExpires: {
        type: Date,
    },
    events: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'event' 
        }
    ],
    joinedEvents: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'event' 
        }
    ],
    forums: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'forum' 
        }
    ],
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'comment' 
        }
    ],
    connections: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'connection' 
        }
    ],
    applications: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'application' 
        }
    ],
});

const Student = mongoose.model('student', studentSchema);

export default Student;