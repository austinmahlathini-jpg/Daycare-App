import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider, useAuth } from './context/authcontext'; 
import Signup from './components/Signup'; 

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="text-center pt-24">Loading...</div>;
  if (!session) return <Navigate to="/signup" replace />;
  return children;
};

function App() {
  return (
    <AuthContextProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            React Supabase Auth & Context
          </h1>
          <p className="mt-2 text-gray-600">Welcome to your Daycare App baseline!</p>
        </header>

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;
