import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './pages/Homepage/Homepage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import CoursePage from './pages/CoursePage/CoursePage.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/courses" element={<CoursePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
