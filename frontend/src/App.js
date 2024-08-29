import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Skeleton } from 'antd';
import { AuthProvider } from './contexts/authContext';
import 'antd/dist/reset.css';
import AppFooter from './components/CustomFooter';
import Navbar from './components/Navbar'; 

const HomePage = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Message = lazy(() => import('./components/Message'));
const ErrorBoundary = lazy(() => import('./utils/ErrorBoundary'));

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthProvider>
      <div id="root">
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar toggleTheme={toggleTheme} currentTheme={theme} /> 
          <Suspense fallback={
            <div style={{ padding: '20px', margin: '100px auto', width: '100%' }}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          }>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<Profile />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
              <Route path='/messages' element={<Message />} />
              <Route path='*' element={<ErrorBoundary />} />
            </Routes>
          </Suspense>
          <AppFooter />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
