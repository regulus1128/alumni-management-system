import mongoose from 'mongoose'


const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  });
  

  
  const Admin = mongoose.model('admin', adminSchema);

  export default Admin;