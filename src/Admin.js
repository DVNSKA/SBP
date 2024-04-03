import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
 
  const handleLogout = () => {
    console.log('Successfully logged out');
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col relative">
      <button 
        className="absolute top-4 right-4 bg-red-500 text-white font-bold py-2 px-4 rounded" 
        onClick={handleLogout}
      >
        <Link to="/login">Logout</Link>
      </button>
      
      <div className="flex justify-center items-center flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <div className="space-y-4">
            <button className="bg-blue-500 m-8 text-white font-bold py-2 px-4 rounded">
              <Link to="/admin/newdept">Add employee</Link>
            </button>
            <button className="bg-blue-500 m-8 text-white font-bold py-2 px-4 rounded">
              <Link to="/admin/task">Task</Link>
            </button>
            <button className="bg-blue-500 m-8 text-white font-bold py-2 px-4 rounded">
              <Link to="/admin/read">View</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;