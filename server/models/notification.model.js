import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipientModel',
      required: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['student', 'alumni'],
    },
    type: {
      type: String,
      required: true,
      enum: [
        'job-application',
        'event-joined',
        'forum-comment',
        'comment-liked',
        'connection-request',
        'connection-accepted',
      ],
    },
    message: { type: String, required: true },
    link: { type: String }, // optional route/page link for frontend
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;