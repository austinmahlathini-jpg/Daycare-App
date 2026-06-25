// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './Context/AuthContext'; 
import Signup from './Components/Signup'; 
import Signin from './Components/Signin'; 
import Dashboard from './Components/Dashboard'; 

/**
 * ProtectedRoute Component
 * 
 * Wraps any route that requires authentication.
 * Redirects unauthenticated users to signup page.
 * Shows loading state during auth check.
 */
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth(); // useAuth comes from AuthContext

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading your daycare dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

/**
 * Main App Component
 * 
 * Sets up routing and wraps the app with AuthContextProvider.
 * Follows vertical slice organization and clean architecture.
 */
function App() {
  return (
    <AuthContextProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Main Router */}
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default/Fallback Route */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './Context/AuthContext'; 
import Signup from './Components/Signup'; 
import Signin from './Components/Signin'; 
import Dashboard from './Components/Dashboard'; 

/**
 * ProtectedRoute Component
 * 
 * Wraps any route that requires authentication.
 * Redirects unauthenticated users to signup page.
 * Shows loading state during auth check.
 */
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth(); // useAuth comes from AuthContext

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading your daycare dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

/**
 * Main App Component
 * 
 * Sets up routing and wraps the app with AuthContextProvider.
 * Follows vertical slice organization and clean architecture.
 */
function App() {
  return (
    <AuthContextProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Main Router */}
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default/Fallback Route */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;
