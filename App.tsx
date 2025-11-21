import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TaskManager from './pages/TaskManager';
import PostsPage from './pages/PostsPage';

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Task Manager is the default home page */}
        <Route path="/" element={<TaskManager />} />
        {/* API Integration page */}
        <Route path="/posts" element={<PostsPage />} />
        {/* Optional: Add a 404 Not Found page */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </MainLayout>
  );
};

export default App;