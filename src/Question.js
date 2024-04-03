import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase';

const Question = () => {
  const { taskId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [responseInputs, setResponseInputs] = useState({});
  const [deptInputs, setDeptInputs] = useState({});
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const tqQuery = query(collection(firestore, 'tq'), where('taskid', '==', taskId));
        const tqSnapshot = await getDocs(tqQuery);
        const tqData = [];
        for (const doc of tqSnapshot.docs) {
          const question = { id: doc.id, ...doc.data(), responses: [], departments: [] };
          const responseQuery = query(collection(firestore, 'response'), where('questionId', '==', doc.data().questionid));
          const responseSnapshot = await getDocs(responseQuery);
          const responseList = responseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          question.responses = responseList;
          const departmentQuery = query(collection(firestore, 'question_dept'), where('questionId', '==', doc.data().questionid));
          const departmentSnapshot = await getDocs(departmentQuery);
          console.log(departmentSnapshot);
          const departmentList = departmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(departmentList);
          question.departments = departmentList;
          console.log(question);
          tqData.push(question);
        }
        setQuestions(tqData);
        initializeInputs(tqData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [taskId, newQuestion]); // Add newQuestion to the dependency array

  const initializeInputs = (questionsData) => {
    const initialResponseInputs = {};
    const initialDeptInputs = {};
    questionsData.forEach(question => {
      initialResponseInputs[question.id] = '';
      initialDeptInputs[question.id] = '';
    });
    setResponseInputs(initialResponseInputs);
    setDeptInputs(initialDeptInputs);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    try {
      const questionId = Math.floor(1000 + Math.random() * 9000);

      const tqRef = collection(firestore, 'tq');
      await addDoc(tqRef, {
        taskid: taskId,
        questionid: questionId.toString(),
        question: newQuestion
      });

      setNewQuestion('');
      setError(null);

      const updatedQuestions = [...questions, { id: questionId, question: newQuestion, responses: [], departments: [] }];
      setQuestions(updatedQuestions);
      setResponseInputs(prevInputs => ({ ...prevInputs, [questionId]: '' }));
      setDeptInputs(prevInputs => ({ ...prevInputs, [questionId]: '' }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResponseSubmit = async (questionId, e) => {
    e.preventDefault();

    try {
      const tqQuestionId = questions.find(question => question.id === questionId)?.questionid;

      if (!tqQuestionId) {
        setError('No corresponding question found.');
        return;
      }

      const responseRef = collection(firestore, 'response');
      await addDoc(responseRef, {
        questionId: tqQuestionId,
        response: responseInputs[questionId]
      });

      setError(null);

      const updatedQuestions = questions.map(question => {
        if (question.id === questionId) {
          const updatedResponses = [...question.responses, { response: responseInputs[questionId] }];
          return { ...question, responses: updatedResponses };
        }
        return question;
      });
      setQuestions(updatedQuestions);

      setResponseInputs(prevInputs => ({ ...prevInputs, [questionId]: '' }));
    } catch (error) {
      setError('Failed to add response.');
    }
  };
  const handleAddDept = async (questionId, e) => {
    e.preventDefault();
  
    try {
      const tqQuestionId = questions.find(question => question.id === questionId)?.questionid;
  
      if (!tqQuestionId) {
        setError('No corresponding question found.');
        return;
      }
  
      const deptRef = collection(firestore, 'question_dept');
      await addDoc(deptRef, {
        questionId: tqQuestionId,
        response: deptInputs[questionId]
      });
  
      setError(null);
  
      // Fetch departments from question_dept collection for the specified questionId
      const deptQuery = query(collection(firestore, 'question_dept'), where('questionId', '==', tqQuestionId));
      const deptSnapshot = await getDocs(deptQuery);
      const departments = deptSnapshot.docs.map(doc => doc.data().response);
  
      // Update the departments array in the questions state for the specified questionId
      const updatedQuestions = questions.map(question => {
        if (question.id === questionId) {
          const updatedDepartments = [...question.departments, ...departments];
          return { ...question, departments: updatedDepartments };
        }
        return question;
      });
  
      setQuestions(updatedQuestions);
      setDeptInputs(prevInputs => ({ ...prevInputs, [questionId]: '' }));
    } catch (error) {
      setError('Failed to add department.');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Question</h2>
      <form onSubmit={handleQuestionSubmit} className="mb-4">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter new question"
          className="w-full border rounded py-2 px-3 mb-3"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      {questions.map(question => (
        <div key={question.id} className="mb-4">
          <p className="text-lg font-bold mb-2">{question.question}</p>
          <form onSubmit={(e) => handleResponseSubmit(question.id, e)} className="mb-4">
            <input
              type="text"
              value={responseInputs[question.id]}
              onChange={(e) => setResponseInputs(prevInputs => ({
                ...prevInputs,
                [question.id]: e.target.value
              }))}
              placeholder="Enter response"
              className="w-50 border rounded py-2 px-3 mb-2"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Response</button>
          </form>
          {question.responses && question.responses.map((response, index) => (
            <p key={index} className="text-gray-700">{response.response}</p>
          ))}
          <br></br>
          <h3 className="text-lg mb-2">Departments:</h3>
          {question.departments && question.departments.map((department, index) => (
            <p key={index} className="text-green-700">{department.response}</p>
          ))}
          <form onSubmit={(e) => handleAddDept(question.id, e)} className="mb-4">
            <input
              type="text"
              value={deptInputs[question.id]}
              onChange={(e) => setDeptInputs(prevInputs => ({ ...prevInputs, [question.id]: e.target.value }))}
              placeholder="Enter department"
              className="w-50 border rounded py-2 px-3 mb-2"
            />
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Department</button>
          </form>
        </div>
      ))}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Question;
