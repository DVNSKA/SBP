import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './Firebase';
import { useNavigate } from 'react-router-dom'; 

const NewTask = () => {
  const [taskValue, setTaskValue] = useState('');
  const navigate = useNavigate(); 

  const generateTaskId = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskId = generateTaskId();

    try {
      const taskRef = collection(firestore, 'task');
      await addDoc(taskRef, {
        taskid: taskId.toString(), 
        taskvalue: taskValue
      });

      setTaskValue('');
      navigate('/admin/task');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mt-4">
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
        </div>
        <div className="flex flex-col justify-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="task" className="block text-gray-700 text-sm font-bold mb-2">Task:</label>
                <input
                  type="text"
                  id="task"
                  value={taskValue}
                  onChange={(e) => setTaskValue(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter task..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
