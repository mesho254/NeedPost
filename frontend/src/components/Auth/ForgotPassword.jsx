import React, { useState } from 'react';
import { Form, Input, Button, Card, notification, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { forgotPassword} from '../../services/api';

const { Link } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      notification.success({ message: 'Password reset email sent' });
    } catch (error) {
      notification.error({ message: 'Failed to send reset email', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        title={<h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Forgot Password</h2>}
        style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          name="forgotPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', marginBottom: '12px' }}>
              Send Reset Link
            </Button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link onClick={() => navigate('/login')}>Back to Login</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
