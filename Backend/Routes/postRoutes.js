const express = require('express');
const { createPost, getPosts, updatePost, deletePost, upload } = require('../Controllers/postController');
const { protect } = require('../MiddleWares/authMiddlware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - item
 *         - description
 *         - location
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         item:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: The description of the item
 *         location:
 *           type: string
 *           description: The location of the item
 *         price:
 *           type: number
 *           description: The price of the item
 *         user:
 *           type: string
 *           description: The ID of the user who created the post (automatically set)
 *       example:
 *         id: 1
 *         item: "Laptop"
 *         description: "A high-performance laptop"
 *         location: "New York"
 *         price: 1200
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve a paginated list of posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of posts to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of posts
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A message indicating that the post was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 */

router.route('/')
    .get(getPosts)
    .post(protect,upload.single('image'), createPost);

router.route('/:id')
    .put(protect, upload.single('image'), updatePost)
    .delete(protect, deletePost);

module.exports = router;
