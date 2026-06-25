// src/Components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Main dashboard page for authenticated parents.
 * Serves as the central hub after login.
 * Displays user info and provides navigation to key features.
 */
const Dashboard = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout and redirects to signin page.
   */
  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-white font-bold">
              D
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text-h)]">Daycare Portal</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-[var(--text-h)]">{userProfile?.full_name || 'Parent'}</span>
            </span>
            
            <button
              onClick={handleSignOut}
              className="px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold text-[var(--text-h)]">
            Good morning, {userProfile?.full_name?.split(' ')[0] || 'Parent'}
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your children's profiles, enrollments, and payments.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Children Card */}
          <div 
            onClick={() => navigate('/children')}
            className="daycare-card p-8 cursor-pointer hover:border-[var(--accent)] group"
          >
            <div className="w-12 h-12 bg-purple-100 text-[var(--accent)] rounded-2xl flex items-center justify-center mb-6 text-3xl">
              👶
            </div>
            <h3 className="text-2xl font-semibold mb-2">My Children</h3>
            <p className="text-gray-600">View, add, and manage your children's profiles</p>
          </div>

          {/* Enrollments Card */}
          <div 
            onClick={() => navigate('/enrollments')}
            className="daycare-card p-8 cursor-pointer hover:border-[var(--accent)] group"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              📅
            </div>
            <h3 className="text-2xl font-semibold mb-2">Enrollments</h3>
            <p className="text-gray-600">Active sessions and booking management</p>
          </div>

          {/* Payments Card */}
          <div 
            onClick={() => navigate('/payments')}
            className="daycare-card p-8 cursor-pointer hover:border-[var(--accent)] group"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              💰
            </div>
            <h3 className="text-2xl font-semibold mb-2">Payments</h3>
            <p className="text-gray-600">View invoices and make payments</p>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="bg-white border border-[var(--border)] rounded-3xl p-8 text-center text-gray-500">
            No recent activity yet. Add a child to get started.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



