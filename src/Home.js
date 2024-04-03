import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your App</h1>
      <div className="flex flex-row justify-center items-center">
        <Link to="/login">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2">Login</button>
        </Link>
        <Link to="/signup">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
