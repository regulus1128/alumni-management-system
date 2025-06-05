import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipient: req.user._id,
        recipientModel: req.user.role
      }).sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error("Fetch notifications error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  };
  
export const markAsRead = async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
  
      res.status(200).json({ success: true, message: "Marked as read", notification });
    } catch (error) {
      console.error("Mark as read error:", error);
      res.status(500).json({ success: false, message: "Failed to mark as read" });
    }
  };