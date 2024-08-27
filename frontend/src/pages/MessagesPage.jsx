import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const MessagesPage = () => {
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Your Messages</h1>
        {/* Placeholder for future implementation of a user's message inbox */}
      </Content>
    </Layout>
  );
};

export default MessagesPage;
