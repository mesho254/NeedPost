const express = require('express');
const { createMessage, getMessages,getMessagesByPostId, updateMessage, deleteMessage } = require('../Controllers/messageController');
const { protect } = require('../MiddleWares/authMiddlware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - postId
 *         - sender
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message
 *         postId:
 *           type: string
 *           description: The ID of the post the message is related to
 *         sender:
 *           type: string
 *           description: The sender of the message
 *         content:
 *           type: string
 *           description: The content of the message
 *       example:
 *         id: 60d0fe4f5311236168a109cb
 *         postId: "60d0fe4f5311236168a109ca"
 *         sender: "John Doe"
 *         content: "Is this still available?"
 */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API endpoints for managing messages
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: The created message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */

/**
 * @swagger
 * /api/messages/{postId}:
 *   get:
 *     summary: Retrieve messages for a specific post
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *   put:
 *     summary: Update a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *       - in: query
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: The updated message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *       - in: query
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message
 *     responses:
 *       200:
 *         description: A message indicating that the message was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message deleted successfully
 */

router.route('/')
    .get(getMessagesByPostId)
    .post(protect, createMessage);

router.route('/:postId')
    .put(updateMessage)
    .delete(deleteMessage);

module.exports = router;
