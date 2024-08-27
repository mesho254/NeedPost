import React from 'react';
import { Form, Input, Button } from 'antd';
import { createMessage } from '../services/api';

const MessageForm = ({ postId, onMessageSent }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const messageData = { ...values, postId };
      const response = await createMessage(messageData);
      onMessageSent(response.data);
      form.resetFields();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="sender" label="Your Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="Message" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Button type="primary" htmlType="submit">Send</Button>
    </Form>
  );
};

export default MessageForm;
