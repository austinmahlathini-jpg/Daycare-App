/ src/Components/Signin.jsx
import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../Context/AuthContext'; 

/**
 * Signin page component.
 * Allows existing parents to log in with email and password.
 * Redirects to dashboard on successful authentication.
 */
const Signin = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { signInUser } = useAuth(); 
  const navigate = useNavigate(); 

  /**
   * Handles signin form submission.
   * Calls auth context and manages loading/error states.
   */
  const handleSignin = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 

    try { 
      const result = await signInUser(email, password); 

      if (result?.success) { 
        navigate('/dashboard'); 
      } else {
        setError(result?.error || 'Invalid email or password.');
      }
    } catch (err) { 
      setError('An unexpected error occurred. Please try again.');
    } finally { 
      setLoading(false); 
    }
  }; 

  return ( 
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to manage your child's daycare profile</p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white"
              type="email" 
              placeholder="Email address" 
              value={email}
              required
            />
          </div>
          
          <div>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white"
              type="password" 
              placeholder="Password" 
              value={password}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">
              {error}
            </p>
          )}
          
          <button 
            disabled={loading} 
            className="w-full p-4 bg-[var(--accent)] hover:bg-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--accent)] hover:underline font-medium">
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}; 

export default Signin;   