import React from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

const { Content } = Layout;

const PostPage = () => {
  const { postId } = useParams();

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Messages</h1>
        <MessageList postId={postId} />
        <h2>Send a Message</h2>
        <MessageForm postId={postId} onMessageSent={() => window.location.reload()} />
      </Content>
    </Layout>
  );
};

export default PostPage;
