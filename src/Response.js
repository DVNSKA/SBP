import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from './Firebase';

const Response = () => {
  const { questionId } = useParams();
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState(null);

  const fetchQuestionAndResponses = async () => {
    try {
      const questionDocRef = doc(firestore, 'questions', questionId);
      const questionDocSnapshot = await getDoc(questionDocRef);
      if (questionDocSnapshot.exists()) {
        setQuestion(questionDocSnapshot.data().question);
      } else {
        console.log('No such document!');
      }

      const responseQuery = query(collection(firestore, 'response'), where('questionId', '==', questionId));
      const responseSnapshot = await getDocs(responseQuery);
      const responseList = responseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResponses(responseList);
    } catch (error) {
      console.error('Error fetching question and responses:', error);
      setError('Failed to fetch question and responses.');
    }
  };

  useEffect(() => {
    fetchQuestionAndResponses();
  }, [questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseRef = collection(firestore, 'response');
      await addDoc(responseRef, {
        questionId: questionId,
        response: newResponse
      });
      setNewResponse('');
      setError(null);
      fetchQuestionAndResponses();
    } catch (error) {
      console.error('Error adding response:', error);
      setError('Failed to add response.');
    }
  };
  
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Question: {question}</h2>
      <h3 className="text-xl font-semibold mb-2">Responses:</h3>
      <ul className="list-disc pl-4 mb-4">
        {responses.map((response, index) => (
          <li key={index} className="mb-2">{response.response}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Enter your response"
          className="px-4 py-2 mr-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Add
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
export default Response;
