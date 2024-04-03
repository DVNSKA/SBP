import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './Firebase';
import CryptoJS from 'crypto-js';

// Constant OTP key
const OTPKey = 'sbp';

// Function to perform OTP encryption
const encryptWithOTP = (text, key) => {
  let encryptedText = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encryptedText += String.fromCharCode(charCode);
  }
  return encryptedText;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      if (loggedInUser.email === 'admin@gmail.com') {
        navigate('/admin'); // Navigate to the admin page
      } else {
        // Encrypt employee email using OTP encryption
        const encryptedEmployeeEmail = encryptWithOTP(email, OTPKey);
        const encodedEncryptedEmployeeEmail = encodeURIComponent(encryptedEmployeeEmail); // URL encode the encrypted employee email
        navigate(`/employee/${encodedEncryptedEmployeeEmail}`); // Navigate to the employee page with the encoded email parameter
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="flex flex-col justify-center items-center">
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
        <div
          type="submit"
          onClick={handleLogin}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-600 mb-3"
        >
          Log In
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
