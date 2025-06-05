import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  alumni: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'alumni' 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'student' 
  },
  joinedStudents: [
    { 
      student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'student'
      },
      name: String,
      email: String,
      contact: String, 
    }
  ],
  joinedAlumni: [
    {
      alumni: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'alumni' 
      },
      name: String,
      email: String,
      contact: String,
    },
  ],
  dateTime: { 
    type: Date, 
    required: true 
  },
}, { timestamps: true }); 


  const Event = mongoose.model('event', eventSchema);

  export default Event;