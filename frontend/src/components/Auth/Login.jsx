import React, { useState } from 'react';
import { Form, Input, Button, notification,  } from 'antd';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      notification.success({ message: 'Login successful' });
      navigate('/');
    } catch (error) {
      notification.error({ message: 'Login failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '150px auto', padding: '50px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
      <Form layout="vertical" onFinish={onFinish} style={{borderRadius:"10px"}}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password"/>
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom:"20px" }}>
          <Link to="/forgotPassword">Forgot Password?</Link>
          <span style={{ margin: '0 10px' }}>|</span>
          <Link to="/register">Create Account</Link>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
