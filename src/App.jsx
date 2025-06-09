import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import BlogListPage from './pages/BlogUploadPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import LoginPage from './pages/Login.jsx';
import EnquiriesPage from './pages/Enquiries.jsx';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Sidebar only if not on login page */}
      {!isLoginPage && <Sidebar />}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/enquiries" element={<EnquiriesPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
