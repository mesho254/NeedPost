import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { getMessagesByPostId } from '../services/api';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getMessagesByPostId();
      setMessages(response.data.messages);
    };

    fetchMessages();
  }, []);

  return (
    <List
      itemLayout="vertical"
      dataSource={messages}
      renderItem={message => (
        <List.Item key={message._id}>
          <List.Item.Meta
            title={`From: ${message.sender}`}
            description={message.content}
          />
        </List.Item>
      )}
    />
  );
};

export default MessageList;