import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './Firebase';
import { useNavigate } from 'react-router-dom'; 

const Newdept = () => {
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usersRef = collection(firestore, 'users');

    try {
      await addDoc(usersRef, {
        email,
        dept
      });

      setEmail('');
      setDept('');

      navigate('/admin');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center relative">
      {}
      <button
        onClick={() => navigate('/admin')}
        className="absolute top-4 left-4 text-blue-500 bg-gray-200 p-2 rounded-full"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
      </button>

      {/* Form for adding new department */}
      <h2 className="text-2xl font-bold mb-4">Add New Department</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
          <input
            type="text"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Newdept;
