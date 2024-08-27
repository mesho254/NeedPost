const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index'); // Ensure the path is correct for your app
const dotenv = require('dotenv');
dotenv.config();


// Import your models
const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const Message = require('../Models/messageModel');

let server;

// Connect to the test database before running tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'your_mongo_test_uri'; // Replace with your test MongoDB URI
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(5000, () => console.log('Test server running'));
});

// Clean up the database after each test
beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Message.deleteMany({});
});

// Close the mongoose connection and server after all tests are complete
afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

// Example Test Suite for User API
describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newtestuser',
        email: 'newtestuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

// Example Test Suite for Post API
describe('Post API', () => {
  it('should create a new post', async () => {
    // Create a user first to authenticate
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'postuser',
        email: 'postuser@example.com',
        password: 'password123',
      });

    const token = userRes.body.token;

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Post');
  });

  it('should fetch all posts', async () => {
    // Fetch all posts
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Example Test Suite for Message API
describe('Message API', () => {
  it('should create a new message', async () => {
    // Create a user and post first to authenticate and associate the message
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'messageuser',
        email: 'messageuser@example.com',
        password: 'password123',
      });

    const token = userRes.body.token;

    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Message Post',
        content: 'This is a post for messaging.',
      });

    const postId = postRes.body._id;

    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        content: 'This is a test message.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a test message.');
  });

  it('should fetch messages by postId', async () => {
    const postRes = await request(app)
      .post('/api/posts')
      .send({
        title: 'Message Post 2',
        content: 'This is another post for messaging.',
      });

    const postId = postRes.body._id;

    const res = await request(app).get(`/api/messages/${postId}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});