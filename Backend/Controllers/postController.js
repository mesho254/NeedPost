const Post = require('../Models/Post');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Multer setup with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts_avatars',  // Folder name in Cloudinary
    format: async (req, file) => 'jpeg',  // Convert all uploads to jpeg format
    public_id: (req, file) => file.originalname.split('.')[0], // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Create a new post
// const createPost = [
//     upload.single('avatar'),
//     async (req, res) => {
//       const { item, description, location, price } = req.body;
//       const user = req.user._id;
  
//       if (!item || !description || !location || !price) {
//           return res.status(400).json({ message: 'All fields are required' });
//       }
  
//       try {
//         let avatarUrl = null;
  
//         // Upload image to Cloudinary if file is present
//         if (req.file) {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'posts_avatars',
//           });
//           avatarUrl = result.secure_url; // Get the URL of the uploaded image
//         }
  
//         const newPost = new Post({
//           item,
//           description,
//           location,
//           price,
//           avatar: avatarUrl,
//           user: user,
//         });
  
//         const createdPost = await newPost.save();
//         res.status(201).json(createdPost);
//       } catch (error) {
//         console.error('Error creating post:', error);
//         res.status(500).json({ message: 'Server error while creating post' });
//       }
//     }
//   ];

const createPost = async (req, res) => {
    const { item, description, location, price } = req.body;
    const user = req.user._id;
    const image = req.file.path;
  
    const newPost = new Post({
        item,
        description,
        location,
        price,
        avatar: image,
        user: user,
      });
  
      const createdPost = await newPost.save();
      res.status(201).json(createdPost);
  };

// Get posts with pagination
const getPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .populate('user', 'username')  // Populate the user field with username
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Post.countDocuments();

        res.status(200).json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  

// Update a post by ID (only by the post owner)
// const updatePost = [
//     upload.single('avatar'),
//     async (req, res) => {
//       const { id } = req.params;
//       const { item, description, location, price } = req.body;
  
//       try {
//         // Find the post by ID
//         const post = await Post.findById(id);
  
//         if (!post) {
//           return res.status(404).json({ message: 'Post not found' });
//         }
  
//         // Check if the user is the author of the post
//         if (post.user.toString() !== req.user._id.toString()) {
//           return res.status(401).json({ message: 'Not authorized' });
//         }
  
//         // Update the post fields
//         post.item = item || post.item;
//         post.description = description || post.description;
//         post.location = location || post.location;
//         post.price = price || post.price;
  
//         // Upload new image to Cloudinary if a new file is present
//         if (req.file) {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'posts_avatars',
//           });
//           post.avatarUrl = result.secure_url;
//         }
  
//         // Save the updated post
//         const updatedPost = await post.save();
//         res.json(updatedPost);
//       } catch (error) {
//         console.error('Error updating post:', error);
//         res.status(500).json({ message: 'Server error' });
//       }
//     },
//   ];

  const updatePost = async (req, res) => {
    const { id } = req.params;
    const { item, description, location, price } = req.body;
  
    const post = await Post.findById(id);
  
    // Check if the user is the author of the post
    if (post.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
    // Update the post fields
    post.item = item || post.item;
    post.description = description || post.description;
    post.location = location || post.location;
    post.price = price || post.price;
  
    if (req.file) {
      post.avatar = req.file.path;
    }
  
    // Save the updated post
    const updatedPost = await post.save();
    res.json(updatedPost);
  };



  
// Delete a post by ID (only by the post owner)
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {  // Ensure user ID comparison
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete post' });
    }
};


module.exports = { createPost, getPosts, updatePost ,deletePost, upload}