import React, { useState } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/api';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      notification.success({ message: 'Password reset successful' });
      navigate('/login');
    } catch (error) {
      notification.error({ message: 'Password reset failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        title={<h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Reset Password</h2>}
        style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
