import React from 'react';
import { Form, Input, Button } from 'antd';
import { createMessage } from '../services/api';
import useAuth from '../hooks/useAuth';

const MessageForm = ({ postId, onMessageSent }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();

  const handleSubmit = async (values) => {
    try {
      // Create the message data, explicitly adding the sender ID
      const messageData = {
        content: values.content,
        postId,
        sender: user._id, // Ensure sender is included
      };

      const response = await createMessage(messageData);
      onMessageSent(response.data);
      form.resetFields();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Display the user's name without binding it to the form data */}
      <Form.Item label="Your Name">
        <Input value={user.user.username} disabled />
      </Form.Item>
      {/* Only include content as part of the form submission */}
      <Form.Item name="content" label="Message" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Button type="primary" htmlType="submit">Send</Button>
    </Form>
  );
};

export default MessageForm;
