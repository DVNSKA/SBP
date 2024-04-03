import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Admin from './Admin';
import Newdept from './Newdept';
import Task from './Task';
import Adminread from './Adminread';
import Newtask from './Newtask';
import Question from './Question';
import Response from './Response';
import Employee from './Employee';
import EmployeeTask from './EmployeeTask';
import DeptSelect from './DeptSelect';

function App() {
  return (
    <Router>

    
        <Routes>
         
          <Route path="/employee/:email" element={<DeptSelect />} />
          <Route path="/employee/:email/:dept/tasks/*" element={<Employee />} />
          <Route path="/task/:taskid/*" element={<EmployeeTask />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/newtask" element={<Newtask />} />
          <Route path="/question/:taskId" element={<Question />} />
          <Route path="/response/:questionId" element={<Response />} />
          <Route path="/admin/newdept" element={<Newdept />} />
          <Route path="/admin/task" element={<Task />} />
          <Route path="/admin/read" element={<Adminread />} />
        </Routes>
   
    </Router>
  );
}

export default App;
