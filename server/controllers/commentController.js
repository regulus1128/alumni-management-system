import Alumni from "../models/alumni.model.js";
import Comment from "../models/comment.model.js";
import Forum from "../models/forum.model.js";
import Notification from "../models/notification.model.js";
import Student from "../models/student.model.js";

export const postComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { forumId } = req.params;
    const { _id, role } = req.user;

    let commenterName = req.user.name;

  if (!commenterName) {
    if (role === "student") {
    const student = await Student.findById(_id).select("name");
    commenterName = student?.name;
  } else {
    const alumni = await Alumni.findById(_id).select("name");
    commenterName = alumni?.name;
  }
}

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const commentData = {
      content,
      forum: forumId,
      ...(role === 'student' ? { student: _id } : { alumni: _id })
    };

    const comment = await Comment.create(commentData);

    if (role === 'student') {
      await Student.findByIdAndUpdate(_id, {
        $push: { comments: comment._id },
      });
    } else {
      await Alumni.findByIdAndUpdate(_id, {
        $push: { comments: comment._id },
      });
    }

    const forum = await Forum.findById(forumId);
    const forumOwner = forum.alumni || forum.student;
    const forumOwnerModel = forum.alumni ? 'alumni' : 'student';

    if (forumOwner.toString() !== _id.toString()) {
      await Notification.create({
        recipient: forumOwner,
        recipientModel: forumOwnerModel,
        type: 'forum-comment',
        message: `${commenterName} commented on your forum "${forum.title}"`,
        link: `/forum-description/${forumId}`
      });
    }

    res.status(201).json({ success: true, message: "Comment posted successfully!", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { forumId } = req.params;
    const comments = await Comment.find({ forum: forumId })
      .populate('alumni', 'name avatar')
      .populate('student', 'name avatar');

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate('alumni', 'name avatar')
      .populate('student', 'name avatar');

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ success: true, message: "Comment updated successfully!", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Comment deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId, role } = req.user; // Must be 'Alumni' or 'Student'

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    let likerName = req.user.name;

  if (!likerName) {
  if (role === "student") {
    const student = await Student.findById(userId).select("name");
    likerName = student?.name;
  } else {
    const alumni = await Alumni.findById(userId).select("name");
    likerName = alumni?.name;
  }
}

    const index = comment.likedBy.findIndex(
      (entry) => entry.user.toString() === userId && entry.role === role
    );

    // Check if this user already liked the comment
    
    let liked = false;

    if (index >= 0) {
      // User has liked already — remove like
      comment.likedBy.splice(index, 1);
      comment.likes -= 1;
    } else {
      // Not liked yet — add like
      comment.likedBy.push({ user: userId, role });
      comment.likes += 1;
      liked = true;
    }    
    await comment.save();

    if (liked) {
      const commentOwner = comment.alumni || comment.student;
      const commentOwnerModel = comment.alumni ? 'alumni' : 'student';

      if (commentOwner.toString() !== userId.toString()) {
        await Notification.create({
          recipient: commentOwner,
          recipientModel: commentOwnerModel,
          type: 'comment-liked',
          message: `${likerName} liked your comment: "${comment.content}"`,
          link: `/forum-description/${comment.forum._id}`
        });
      }
    }

    res.status(200).json({ success: true, message: "Comment liked successfully!", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



