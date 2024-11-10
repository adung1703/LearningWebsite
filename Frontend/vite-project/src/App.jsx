import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './pages/Homepage/Homepage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import CoursePage from './pages/CoursePage/CoursePage.jsx';
import LessonPage from './pages/LessonPage/LessonPage.jsx';
import ModifyCoursePage from './pages/ModifyCoursePage/ModifyCoursePage.jsx';
import CodeSubmissionPage from './pages/CodeSubmissionPage/CodeSubmissionPage.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/course/:courseId" element={<CoursePage />} /> 
        <Route path="/lesson/:courseId/:lessonId" element={<LessonPage />} /> {/* Updated route */}
        <Route path="/modify-course/:courseId" element={<ModifyCoursePage />} /> 
        <Route path="/code-submission" element={<CodeSubmissionPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;