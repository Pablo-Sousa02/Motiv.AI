import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import TaskList from './components/TaskList';
import GoalTracker from './components/GoalTracker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MeuPerfil from './components/MeuPerfil';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          <Route
            path="/tarefas"
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />
          <Route
            path="/metas"
            element={
              <PrivateRoute>
                <GoalTracker />
              </PrivateRoute>
            }
          />
          <Route 
          path="/perfil"
          element={
            <PrivateRoute>
              <MeuPerfil />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
