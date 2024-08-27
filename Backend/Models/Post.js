const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  item: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  avatar: { type: String }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
