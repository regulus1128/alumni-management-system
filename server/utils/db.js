import mongoose from 'mongoose'

const URI = process.env.MONGODB_URI;

export const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("DB connected successfully!");
    } catch (error) {
        console.error("DB connection failed!");
        process.exit(0);
    }
}
