import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase';
import { useNavigate } from 'react-router-dom';

const Adminread = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [employeeResponses, setEmployeeResponses] = useState([]);
  const [tasks, setTasks] = useState({});
  const [questions, setQuestions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const uniqueDepartments = new Set();
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.dept) {
            uniqueDepartments.add(userData.dept);
          }
        });
        setDepartments(Array.from(uniqueDepartments));
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchAllTasks = async () => {
      try {
        const tasksCollection = collection(firestore, 'task');
        const tasksSnapshot = await getDocs(tasksCollection);
        const allTasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          taskid: doc.data().taskid,
          taskvalue: doc.data().taskvalue
        }));
        setAllTasks(allTasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchEmployeeResponses = async () => {
      try {
        const employeeResponseCollection = collection(firestore, 'employee_reponse');
        const employeeResponseSnapshot = await getDocs(employeeResponseCollection);
        const employeeResponseData = employeeResponseSnapshot.docs.map(doc => doc.data());
        setEmployeeResponses(employeeResponseData);
      } catch (error) {
        console.error('Error fetching employee responses:', error);
      }
    };

    const fetchTasksAndQuestions = async () => {
      try {
        const tasksCollection = collection(firestore, 'task');
        const tasksSnapshot = await getDocs(tasksCollection);
        const taskData = {};
        tasksSnapshot.forEach(doc => {
          const task = doc.data();
          const taskId = doc.id;
          taskData[task.taskid] = task.taskvalue;
        });
        setTasks(taskData);

        const tqCollection = collection(firestore, 'tq');
        const tqSnapshot = await getDocs(tqCollection);
        const questionData = {};
        tqSnapshot.forEach(doc => {
          const tq = doc.data();
          questionData[doc.id] = tq.question;
        });
        setQuestions(questionData);
      } catch (error) {
        console.error('Error fetching tasks and questions:', error);
      }
    };

    fetchDepartments();
    fetchAllTasks();
    fetchEmployeeResponses();
    fetchTasksAndQuestions();
  }, []);

  const handleChangeDepartment = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedTask(''); // Reset selected task when changing department
  };

  const handleChangeTask = (e) => {
    setSelectedTask(e.target.value);
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <button
        onClick={handleBack}
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
      <h1 className="text-2xl font-bold mb-4 mt-8"> Employee Responses</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="department" className="mr-2">Select Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleChangeDepartment}
          className="border border-gray-300 rounded-md p-2 select"
        >
          <option value="">Select Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>{department}</option>
          ))}
        </select>
        <label htmlFor="task" className="ml-4 mr-2">Select Task:</label>
        <select
          id="task"
          value={selectedTask}
          onChange={handleChangeTask}
          className="border border-gray-300 rounded-md p-2 select"
        >
          <option value="">Select Task</option>
          {allTasks.map((task, index) => (
            <option key={index} value={task.taskid}>{task.taskvalue}</option>
          ))}
        </select>
      </div>
      {selectedDepartment && selectedTask && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Task Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeeResponses
                .filter(response => response.dept === selectedDepartment && response.taskid === selectedTask)
                .map((response, index) => {
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap">{response.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tasks[response.taskid]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{questions[response.questionid]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{response.res}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Adminread;
