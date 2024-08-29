import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Typography, Button, Select, Table, Space, Modal, Input } from 'antd';
import { getPosts, deletePost } from '../services/api';
import { EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined, TableOutlined, MessageOutlined } from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import PostForm from './PostForm';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [filter, setFilter] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false); 
  const navigate = useNavigate()

  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleMessage = (postId) => {
    if (!user || !user.user) {
      navigate('/login');
    } else {
      setSelectedPostId(postId);
      setIsMessageModalVisible(true);
    }
  };

  const handleMessageSent = () => {
    if (selectedPostId) {
      setSelectedPostId(null);
      setSelectedPostId(selectedPostId);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setIsMessageModalVisible(false);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsMessageModalVisible(false);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsModalVisible(true);
  };

  const filteredPosts = posts.filter(post => post.item.toLowerCase().includes(filter.toLowerCase()));

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
    { title: 'User', dataIndex: ['user', 'username'], key: 'user' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          {user.user && user.user.id === record.user._id && (
            <>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger>Delete</Button>
              <MessageOutlined onClick={() => handleMessage(record._id)} />
            </>
          )}
        </Space>
      ),
    },
  ];

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>Posts</Title>
        <div>
          <Input
            placeholder="Search posts"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginRight: '10px', width: '200px' }}
          />
          <Select value={viewMode} onChange={setViewMode} style={{ marginRight: '10px' }}>
            <Option value="card"><AppstoreOutlined /> Card View</Option>
            <Option value="table"><TableOutlined /> Table View</Option>
          </Select>
          {user.user ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePost}>
            Add New Post
          </Button>
        ):(
          <div></div>
        )}
        </div>
      </div>

      {viewMode === 'card' ? (
        <Row gutter={[16, 16]} justify="center">
          {filteredPosts.map(post => (
            <Col xs={24} sm={12} md={8} lg={8} key={post._id}>
              <Card
                hoverable
                cover={<img alt="avatar" src={post.avatar} style={{  width: '100%', height: '250px', objectFit: 'contain' }} />}
                actions={
                  user && user.user.id === post.user._id? [
                    <EditOutlined onClick={() => handleEdit(post)} />,
                    <DeleteOutlined onClick={() => handleDelete(post._id)} />,
                    <MessageOutlined onClick={() => handleMessage(post._id)} />,
                  ] : [<MessageOutlined onClick={() => handleMessage(post._id)} />]
                }
                style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative',  maxWidth: "400px" }}
              >
                <Card.Meta
                  title={post.item}
                  description={`${post.description} - $${post.price}`}
                />
                <p style={{ marginTop: '10px' }}>{post.location}</p>
                <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Posted by: {post.user.username}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Table dataSource={filteredPosts} columns={columns} rowKey="_id" />
      )}

      <Modal
        title={selectedPost ? 'Edit Post' : 'Create Post'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <PostForm post={selectedPost} onSuccess={handleOk} />
      </Modal>

      <Modal
        title="Messages"
        visible={isMessageModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <MessageList postId={selectedPostId} />
        <MessageForm postId={selectedPostId} onMessageSent={handleMessageSent} />
      </Modal>
    </div>
  );
};

export default PostList;
