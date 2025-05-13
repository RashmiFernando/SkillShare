import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import AuthScreen from './pages/AuthScreen';
import App from './App';
import Tutorials from './TutorialList';
import LearnPage from './LearnPage';
import ViewAllTutorials from './ViewAllTutorialsAdmin';
import AddTutorialForm from './AddTutorialForm';
import TutorialForm from './TutorialForm';
import Profile from './components/Profile';
import QuizPage from './QuizPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/posts" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/learn/:id" element={<LearnPage />} />
        <Route path="/admin/tutorials" element={<ViewAllTutorials />} />
        <Route path="/admin/tutorials/add" element={<AddTutorialForm />} />
        <Route path="/admin/tutorial-form/:id" element={<TutorialForm />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);