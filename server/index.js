import express from "express";
import cors from 'cors';
import "dotenv/config";
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRoute.js";
import jobRouter from "./routes/jobRoute.js";
import forumRouter from "./routes/forumRoute.js";
import commentRouter from "./routes/commentRoute.js";
import eventRouter from "./routes/eventRoute.js";
import adminRouter from "./routes/admin.route.js";
import profileRouter from "./routes/profile.route.js";
import alumniRouter from "./routes/alumni.route.js";
import connectionRouter from "./routes/connection.route.js";
import { connectDb } from "./utils/db.js";
import applicationRouter from "./routes/application.route.js";
import notificationRouter from "./routes/notification.route.js";
import conversationRouter from "./routes/conversation.route.js";
import messageRouter from "./routes/message.route.js";
import courseRouter from "./routes/course.route.js";
import router from "./routes/resource.route.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;



app.use(cors({
    origin: [
      "https://alumverse-teal.vercel.app"
    ],
    credentials: true
  }));


app.use(cookieParser());
app.use(express.json());

connectDb();

app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);
app.use('/api/forum', forumRouter);
app.use('/api/comment', commentRouter);
app.use('/api/event', eventRouter);
app.use('/api/profile', profileRouter)
app.use('/api/alumni', alumniRouter);
app.use('/api/connection', connectionRouter);
app.use('/api/application', applicationRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);
app.use('/api/resource', router);

// Admin routes
app.use("/api/admin", adminRouter);
app.use('/api/course', courseRouter);


app.get('/', (req, res) => {
    res.send('Hello');
});


server.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT} ✅`)
});