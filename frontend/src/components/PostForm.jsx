import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { createPost, updatePost } from '../services/api';
import useAuth from '../hooks/useAuth';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ post = null, onCancel }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      form.setFieldsValue(post);
      if (post.avatar) {
        setFileList([{ url: post.avatar, name: 'image' }]);
      }
    } else {
      form.resetFields();
    }
  }, [post, form]);

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      setLoading(true);
      if (post) {
        await updatePost(post._id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        message.success('Post updated successfully');
      } else {
        await createPost(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        message.success('Post created successfully');
      }
      
      setLoading(false);
      navigate('/');  // Navigate to the home page
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Failed to submit post:', error);
      message.error('Failed to submit post');
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} encType="multipart/form-data">
      <Form.Item name="item" label="Item or Service" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="location" label="Preferred Location" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="price" label="Desired Price" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Avatar (optional)">
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent automatic upload
        >
          <Button icon={<UploadOutlined />}>Upload (Optional)</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
          {post ? 'Update Post' : 'Create Post'}
        </Button>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;
