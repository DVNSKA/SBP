import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const key = 'sbp'; // OTP key

const Employee = () => {
  const navigate = useNavigate();
  const { email, dept } = useParams(); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const decryptEmailWithOTP = (encryptedEmail) => {
      let decryptedEmail = '';
      for (let i = 0; i < encryptedEmail.length; i++) {
        const charCode = encryptedEmail.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decryptedEmail += String.fromCharCode(charCode);
      }
      return decryptedEmail;
    };

    const fetchTasks = async () => {
      try {
        const decryptedEmail = decryptEmailWithOTP(email); // Decrypt email using OTP
        const db = getFirestore();
        const taskCollection = collection(db, 'task');
        const taskSnapshot = await getDocs(taskCollection);
        const allTasks = taskSnapshot.docs.map(doc => doc.data().taskid);

        const responseCollection = collection(db, 'employee_reponse');
        const responseQuery = query(responseCollection, where('email', '==', decryptedEmail), where('dept', '==', dept));
        const responseSnapshot = await getDocs(responseQuery);
        const respondedTasks = responseSnapshot.docs.map(doc => doc.data().taskid);

        const tasksToDisplay = allTasks.filter(task => !respondedTasks.includes(task));
        
        const tasksQuery = query(taskCollection, where('taskid', 'in', tasksToDisplay));
        const filteredTasksSnapshot = await getDocs(tasksQuery);
        const taskList = filteredTasksSnapshot.docs.map(doc => ({
          id: doc.id,
          taskid: doc.data().taskid,
          taskvalue: doc.data().taskvalue
        }));

        setTasks(taskList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [email, dept]);

  const handleTaskClick = (taskid) => {
    navigate(`/task/${taskid}?email=${email}&dept=${dept}`); 
  };

  const handleBackClick = () => {
    navigate(`/employee/${email}`); // Navigate to the DeptSelect page with the email parameter
  };

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (error) {
    if(error.message==="Invalid Query. A non-empty array is required for 'in' filters."){
      return (
        <div className="container mx-auto mt-8 text-center">
          <h1 className="text-center text-2xl font-bold bg-gray-200 rounded-lg py-4">No task remaining</h1>
        </div>
      );
    }
    return <div className="container mx-auto mt-8 text-center">Error: {error.message}</div>;
  }

  return tasks.length === 0 ? (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-center text-2xl font-bold bg-gray-200 rounded-lg py-4">No task remaining</h1>
    </div>
  ) : (
    
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold ml-4">Employee Component</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <li key={task.id} onClick={() => handleTaskClick(task.taskid)} className="bg-blue-50 border border-gray-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
                <p className="text-lg font-semibold">Task: {task.taskvalue}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Employee;
