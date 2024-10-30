import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './pages/Homepage/Homepage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import CoursePage from './pages/CoursePage/CoursePage.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/courses" element={<CoursePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
