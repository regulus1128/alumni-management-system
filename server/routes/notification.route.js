import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import authorizeRole from "../middlewares/auth.js";

const notificationRouter = express.Router();

notificationRouter.get('/notifications', authorizeRole(['student', 'alumni']), getNotifications);
notificationRouter.put('/notifications/:id', authorizeRole(['student', 'alumni']), markAsRead);

export default notificationRouter;