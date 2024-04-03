import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {app} from './Firebase'; 

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth(app); 
    try {
      await createUserWithEmailAndPassword(auth, email, password);
     
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col justify-center items-center">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 mb-3"
        />
        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
