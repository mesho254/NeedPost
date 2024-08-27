const Message = require('../Models/Message');
const mongoose = require('mongoose');
// const { validationResult } = require('express-validator');

const sendMessage = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { receiverId, message } = req.body;

  try {
    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiverId,
      message,
      delivered: true
    });

    await newMessage.save();

    // Emit message to both sender and receiver rooms
    req.app.io.to(req.user._id.toString()).emit('message', newMessage);
    req.app.io.to(receiverId.toString()).emit('message', newMessage);

    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  }).populate('sender', 'username profilePicture').populate('receiver', 'username profilePicture');
  
  res.json(messages);
};

// Get all messages for a specific postId
const getMessagesByPostId = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const messages = await Message.find({ postId })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sender', 'username profilePicture');

    const total = await Message.countDocuments({ postId });

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      messages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a message by ID
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedMessage) {
      // Emit the message update to the room corresponding to the postId
      req.app.io.to(updatedMessage.postId.toString()).emit('messageUpdated', updatedMessage);

      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const messageToDelete = await Message.findById(id);

    if (messageToDelete) {
      await Message.findByIdAndDelete(id);

      // Emit the message deletion to the room corresponding to the postId
      req.app.io.to(messageToDelete.postId.toString()).emit('messageDeleted', messageToDelete._id);

      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    await Message.updateMany(
      { receiver: req.user.id, sender: userId, read: false },
      { $set: { read: true } }
    );

    // Emit read status update to sender
    req.app.io.to(userId.toString()).emit('read', { userId: req.user.id });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getUnreadMessageCount = async (req, res) => {
  try {
    
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { sendMessage, getMessages, markMessagesAsRead, getUnreadMessageCount, updateMessage, deleteMessage, getMessagesByPostId };
