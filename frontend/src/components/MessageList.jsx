import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { getMessagesByPostId } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust URL as needed

const MessageList = ({ postId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getMessagesByPostId(postId);
      setMessages(response.data.messages);
    };

    fetchMessages();

    // Join the room corresponding to the postId
    socket.emit('joinRoom', postId);

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up when component unmounts
    return () => {
      socket.emit('leaveRoom', postId);
      socket.off('newMessage');
    };
  }, [postId]);

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
