import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase';

const Task = () => {
  const [oldTasks, setOldTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksQuery = query(collection(firestore, 'task'));
        const taskSnapshot = await getDocs(tasksQuery);
        const tasksData = taskSnapshot.docs.map(doc => ({ id: doc.id, taskid: doc.data().taskid, ...doc.data() }));

        const tqQuery = query(collection(firestore, 'tq'));
        const tqSnapshot = await getDocs(tqQuery);
        const tqData = tqSnapshot.docs.map(doc => doc.data().taskid);

        const oldTasksFiltered = tasksData.filter(task => tqData.includes(task.taskid));
        const newTasksFiltered = tasksData.filter(task => !tqData.includes(task.taskid));

        setOldTasks(oldTasksFiltered);
        setNewTasks(newTasksFiltered);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (taskId) => {
    navigate(`/question/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
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
          <div>
            <h2 className="text-3xl font-bold">Tasks</h2>
          </div>
          <Link to="/newtask" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add New Task
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Old Tasks</h3>
            {oldTasks.length > 0 ? (
              <ul>
                {oldTasks.map(task => (
                  <li className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition duration-300 mb-4" key={task.id} onClick={() => handleTaskClick(task.taskid)}>
                    {task.taskvalue}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No old tasks available</p>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">New Tasks</h3>
            {newTasks.length > 0 ? (
              <ul>
                {newTasks.map(task => (
                  <li className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition duration-300 mb-4" key={task.id} onClick={() => handleTaskClick(task.taskid)}>
                    {task.taskvalue}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No new tasks available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
