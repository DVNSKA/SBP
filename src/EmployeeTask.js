import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const key = 'sbp';
const decryptWithOTP = (text, key) => {
  let decryptedText = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decryptedText += String.fromCharCode(charCode);
  }
  return decryptedText;
};

const EmployeeTask = () => {
  const { taskid } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedEmail = queryParams.get('email'); 
  const email = decryptWithOTP(encodedEmail, key); 
  const dept = queryParams.get('dept');
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [optionsMap, setOptionsMap] = useState({});
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
const tqCollection = collection(db, 'tq');
const q = query(tqCollection, where('taskid', '==', taskid));
const tqSnapshot = await getDocs(q);
const questionsList = tqSnapshot.docs.map(doc => ({
  id: doc.id,
  questionId: doc.data().questionid,
  question: doc.data().question
}));

const deptQuery = query(collection(db, 'question_dept'), where('response', '==', dept));
const deptSnapshot = await getDocs(deptQuery);
const questionIds = deptSnapshot.docs.map(doc => doc.data().questionId);

if (questionIds.length === 0) {
  console.error('No question IDs found for the department.');
  setError({ message: 'No question IDs found for the department.' });
  setLoading(false);
  return;
}


const updatedQuestionsList = questionsList.filter(question => questionIds.includes(question.questionId));


console.log(updatedQuestionsList);


        setQuestions(updatedQuestionsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [taskid]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (!taskid) return;

        const db = getFirestore();
        const responseCollection = collection(db, 'response');
        const optionsMap = {};
        for (const question of questions) {
          const questionIdString = question.questionId.toString();
          const q = query(responseCollection, where('questionId', '==', questionIdString));
          const responseSnapshot = await getDocs(q);
          const optionsList = responseSnapshot.docs.map(doc => doc.data().response);
          optionsMap[question.id] = optionsList;
        }
        setOptionsMap(optionsMap);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    if (questions.length > 0) {
      fetchOptions();
    }
  }, [taskid, questions]);

  const handleResponseChange = (questionId, response) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: response
    }));
  };

  const handleSubmit = async () => {
    try {
      const db = getFirestore();
      const responseCollection = collection(db, 'employee_reponse');

      for (const questionId in responses) {
        const response = responses[questionId];
        await addDoc(responseCollection, {
          email: email, 
          dept: dept,
          taskid: taskid,
          questionid: questionId,
          res: response
        });
      }

      console.log('Responses added successfully');
      
      navigate(`/employee/${encodedEmail}/${dept}/tasks/`); 
    } catch (error) {
      console.error('Error adding responses:', error);
    }
  };

  const handleBackClick = () => {
    
    navigate(`/employee/${encodedEmail}/${dept}/tasks/`);
  };

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-8 text-center">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto mt-8 text-center">
      <div className="absolute top-4 left-4">
        
      </div>
      <h1 className="text-2xl font-bold mb-4">Employee Task</h1>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Questions</h2>
        {questions.map((question, index) => (
          <div key={question.id} className="p-4 border border-gray-300 rounded-lg mb-4">
            <p className="text-lg font-semibold">{question.question}</p>
            <div>
              {optionsMap[question.id] && optionsMap[question.id].length > 0 ? (
                <ul>
                  {optionsMap[question.id].map((option, index) => (
                    <li key={index}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          onChange={() => handleResponseChange(question.id, option)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No options available for this question</p>
              )}
            </div>
          </div>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default EmployeeTask;