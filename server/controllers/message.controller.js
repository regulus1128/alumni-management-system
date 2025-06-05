import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
      const { conversationId, content } = req.body;
      const { _id: userId, role } = req.user;
  

      const message = await Message.create({
        conversationId,
        text: content,
        sender: {
          user: userId,
          role: role
        }
      });
  
      const populatedMessage = await message.populate('sender.user', 'name avatar');
      res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };


  export const getMessages = async (req, res) => {
    try {
      const { conversationId } = req.query;
  
      const messages = await Message.find({ conversationId }).populate('sender.user', 'name avatar');
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error("Fetch messages error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
