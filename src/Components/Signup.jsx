import React, { useState } from 'react'; // Added useState import
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
// Imported the custom hook from your context file

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Changed to a boolean false so disabled works

  const { session } = useAuth(); // Corrected UserAuth to useAuth to match your file
  console.log(session);

  return (
    <div>
      <form className="max-w-md m-auto pt-24">
       <h2 className="text-2xl font-bold pb-2 text-center text-gray-800">Sign up today </h2>
        <p>
          Already have an account? <Link to="/signin">Sign in!</Link>
        </p>

      <div className='flex flex-col py-4'>
      <input className='p-3 mt-6 border border-gray-300 rounded bg-white text-black focus:outline-blue-500' type='email' placeholder='Email Address' />
      <input className='p-3 mt-6 border border-gray-300 rounded bg-white text-black focus:outline-blue-500' type='password' placeholder='Password' />
      <button type='submit' disabled={loading} className='mt-6 w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition'>Signup</button>
      </div> 
      </form>
    </div>
  );
};

export default Signup;