
import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/authcontext'; 

const Signup = () => { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { session, signupNewUser } = useAuth(); 
  const navigate = useNavigate(); 
  
  

  const handleSignup = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 

    try { 
      const result = await signupNewUser(email, password); 
      if (result?.success) { 
        navigate('/dashboard'); 
      } 
    } catch (err) { 
      setError('An error occurred'); 
    } finally { 
      setLoading(false); 
    }
  }; 

  return ( 
    <div> 
      <form onSubmit={handleSignup} className="max-w-md m-auto pt-24"> 
        <h2 className="text-2xl font-bold pb-2 text-center text-gray-800">Sign up today</h2> 
        <p className="text-center"> 
          Already have an account? <Link to="/signin">Sign in!</Link> 
        </p> 

        <div className='flex flex-col py-4'> 
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            className='p-3 mt-6 border border-gray-300 rounded bg-white text-black focus:outline-blue-500' 
            type='email' 
            placeholder='Email address' 
            value={email} 
          />
        </div>
        
        <div className='flex flex-col py-4'> 
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            className='p-3 border border-gray-300 rounded bg-white text-black focus:outline-blue-500' 
            type='password' 
            placeholder='Password' 
            value={password} 
          />
        </div>

        {error && <p className='text-red-500 text-center'>{error}</p>}
        
        <button 
          disabled={loading} 
          className='w-full p-3 my-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50'
          type='submit'
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form> 
    </div> 
  );
}; 

export default Signup;     