import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const DepartmentSelection = () => {
  const navigate = useNavigate();
  const { email } = useParams(); 
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const decryptEmailWithOTP = (encryptedEmail) => {
      const OTPKey = 'sbp'; // Use the same OTP key as in the login component
      let decryptedEmail = '';
      for (let i = 0; i < encryptedEmail.length; i++) {
        const charCode = encryptedEmail.charCodeAt(i) ^ OTPKey.charCodeAt(i % OTPKey.length);
        decryptedEmail += String.fromCharCode(charCode);
      }
      return decryptedEmail;
    };

    const fetchDepartments = async () => {
      try {
        const decryptedEmail = decryptEmailWithOTP(decodeURIComponent(email)); // Decrypt the email
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', decryptedEmail));
        const usersSnapshot = await getDocs(q);
        const userDocs = usersSnapshot.docs;
        const userDepartments = userDocs.map(doc => doc.data().dept); 
        setDepartments(userDepartments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchDepartments();

    // Log decrypted email for debugging
    console.log('Decrypted Email:', decryptEmailWithOTP(decodeURIComponent(email)));
  }, [email]);

  const handleDepartmentSelect = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedDepartment) {
      navigate(`/employee/${email}/${selectedDepartment}/tasks/`);
    }
  };

  const handleLogout = () => {
    console.log('Successfully logged out');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="absolute top-4 left-4">
        <button 
          className="text-blue-500 bg-gray-200 p-2 rounded-full"
          onClick={handleBack}
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
      <h2 className="text-2xl font-semibold mb-4">Select Your Department</h2>
      <select 
        className="border border-gray-300 rounded p-2 mb-4"
        onChange={handleDepartmentSelect}
      >
        <option value="">Select Department</option>
        {departments.map((department, index) => (
          <option key={index} value={department}>
            {department}
          </option>
        ))}
      </select>
      <button 
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedDepartment ? '' : 'opacity-50 cursor-not-allowed'}`}
        onClick={handleSubmit}
        disabled={!selectedDepartment}
      >
        Submit
      </button>
    </div>
  );
};

export default DepartmentSelection;
