import React, { useState } from 'react';
import { Form, Input, Button, Card, notification, Typography } from 'antd';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Link } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.username, values.email, values.password);
      notification.success({ message: 'Registration successful' });
      navigate('/login');
    } catch (error) {
      notification.error({ message: 'Registration failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        title={<h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Register</h2>}
        style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', marginBottom: '12px' }}>
              Register
            </Button>
            <div style={{ textAlign: 'center' }}>
              <Link onClick={() => navigate('/login')}>Already have an account? Login</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
