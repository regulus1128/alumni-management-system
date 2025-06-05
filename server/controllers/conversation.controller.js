import Conversation from "../models/conversation.model.js";

export const getOrCreateConversation = async (req, res) => {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { recipientId, recipientRole } = req.body;
  
      // Check if a conversation already exists
      const existing = await Conversation.findOne({
        members: {
          $all: [
            { $elemMatch: { user: userId, role: userRole } },
            { $elemMatch: { user: recipientId, role: recipientRole } },
          ],
        },
      });
  
      if (existing) {
        return res.status(200).json({ success: true, conversation: existing });
      }
  
      // Create a new conversation
      const newConversation = await Conversation.create({
        members: [
          { user: userId, role: userRole },
          { user: recipientId, role: recipientRole },
        ],
      });
  
      res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
      console.error("Conversation error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserConversations = async (req, res) => {
    try {
      const { _id: userId, role } = req.user;
  
      const conversations = await Conversation.find({
        members: { $elemMatch: { user: userId, role } },
      }).populate("members.user", "name avatar");
  
      res.status(200).json({ success: true, conversations });
    } catch (error) {
      console.error("Fetch conversations error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
};