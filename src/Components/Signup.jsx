// src/Components/Signup.jsx
import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../Context/AuthContext'; 

/**
 * Signup page component.
 * Handles new parent registration with email and password.
 * Redirects to dashboard on successful signup.
 */
const Signup = () => { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [fullName, setFullName] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { signupNewUser } = useAuth(); 
  const navigate = useNavigate(); 

  /**
   * Processes signup form submission.
   * Validates input and calls auth context method.
   */
  const handleSignup = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 

    try { 
      const result = await signupNewUser({ 
        email, 
        password, 
        fullName 
      }); 

      if (result?.success) { 
        navigate('/dashboard'); 
      } else {
        setError(result?.error || 'Signup failed. Please try again.');
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
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our daycare parent portal</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <input 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white"
              type="text" 
              placeholder="Full Name" 
              value={fullName}
              required
            />
          </div>

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
              placeholder="Password (min 6 characters)" 
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-[var(--accent)] hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}; 

export default Signup;