import axiosInstance from "../axiosConfig";

// Post API requests
export const createPost = (postData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.post(`/posts`, postData, config);
};

export const getPosts = (page = 1, limit = 10) => axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
export const updatePost = (id, postData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.put(`/posts/${id}`, postData, config);
};

export const deletePost = (id) => axiosInstance.delete(`/posts/${id}`);

// Message API requests
export const createMessage = (messageData) => axiosInstance.post(`/messages`, messageData );
export const getMessagesByPostId = (postId) => axiosInstance.get(`/messages/${postId}`);
export const updateMessage = (postId, messageId, messageData) => axiosInstance.put(`/messages/${postId}/${messageId}`, messageData );
export const deleteMessage = (postId, messageId) => axiosInstance.delete(`/messages/${postId}/${messageId}` );

// Auth API requests
export const loginUser = (email, password) => axiosInstance.post(`/auth/login`, { email, password });
export const registerUser = (username, email, password) => axiosInstance.post(`/auth/register`, { username, email, password });
export const forgotPassword = (email) => axiosInstance.post(`/auth/forgotPassword`, { email });
export const resetPassword = (id, token, password) => axiosInstance.post(`/auth/resetPassword/${id}/${token}`, { password });
