import mongoose from 'mongoose'
import { GENDERS } from '../constants/constants.js'


const alumniSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
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
    graduatedIn: { 
        type: Number, 
        required: true 
    },
    dept: { 
        type: String, 
        required: true 
    },
    jobRole: { 
        type: String, 
        default: "Currently not employed." 
    },
    company: { 
        type: String, 
        default: "NA" 
    },
    phone: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String,
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    verificationCode: { 
        type: String 
    },
    verificationCodeExpires: { 
        type: Date 
    },
    jobs: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'job' 
        }
    ],
    events: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'event' 
        }
    ],
    joinedEvents: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'event' 
        }
    ],
    forums: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'forum' 
        }
    ],
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'comment' 
        }
    ],
    receivedConnections: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'connection' 
        }
    ],
    sentConnections: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'connection' 
        }
    ],
    applications: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'application' 
        }
    ],
});

const Alumni = mongoose.model('alumni', alumniSchema);

export default Alumni;