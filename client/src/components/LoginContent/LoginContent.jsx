import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginContent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('Login Response:', response.data);
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ username: response.data.username }));
  
      alert(`Welcome, ${response.data.username}!`);
      navigate('/room');
    } catch (error) {
      console.error('Login Error:', error.response.data);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-[#2d2d2d]">Log In</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-200">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginContent;
