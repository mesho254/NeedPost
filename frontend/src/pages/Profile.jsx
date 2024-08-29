import React, { useEffect, useState } from 'react';
import { Card, Tabs, List, Avatar, message } from 'antd';
import axiosInstance from '../axiosConfig';

const { TabPane } = Tabs;

function Profile() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details (You need to implement the API call)
    axiosInstance.get('/auth/profile')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        message.error('Failed to load user details');
      });

    // Fetch posts by the logged-in user
    axiosInstance.get(`/posts/myPosts/${user._id}`) // This assumes you've added a query param to get posts by the logged-in user
      .then(response => {
        setPosts(response.data.posts);
        setLoading(false);
      })
      .catch(error => {
        message.error('Failed to load posts');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Card
        style={{ marginBottom: 24 }}
        title={`${user.username}'s Profile`}
        bordered={false}
      >
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more user details as needed */}
      </Card>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Posts" key="1">
          <List
            itemLayout="horizontal"
            dataSource={posts}
            loading={loading}
            renderItem={post => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={post.avatar} />}
                  title={post.item}
                  description={post.description}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Messages" key="2">
          <p>Messages content goes here...</p>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
