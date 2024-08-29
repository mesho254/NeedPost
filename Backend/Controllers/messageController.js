const Message = require('../Models/Message');
const User = require('../Models/User');

// Create a new message
exports.createMessage = async (req, res) => {
  const { postId, content, receiverId } = req.body; // Add receiverId to the request body
  const sender = req.user._id; // Get the sender from the authenticated user

  try {
    const message = new Message({ postId, sender, content });
    await message.save();

    // Update sender's sentMessages
    await User.findByIdAndUpdate(sender, {
      $push: { sentMessages: message._id }
    });

    // Update receiver's receivedMessages
    await User.findByIdAndUpdate(receiverId, {
      $push: { receivedMessages: message._id }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};


exports.getMessagesByPostId = async (req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const messages = await Message.find({ postId })
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const total = await Message.countDocuments({ postId });
  
      res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        messages,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Update a message by ID
exports.updateMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMessage = await Message.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedMessage);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update message' });
    }
  };

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
      await Message.findByIdAndDelete(id);
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete message' });
    }
  };