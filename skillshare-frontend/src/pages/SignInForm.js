import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';

function SignInForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      setAlert({ message: 'Email and password are required', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: formData.email,
        password: formData.password,
      });
      // Store token (simplified; in production, use secure storage)
      localStorage.setItem('token', response.data.token);
      setAlert({ message: 'Sign-in successful!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to sign in',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        <h1 className="text-3xl font-bold text-orange-700 text-center mb-6">
          Sign In
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C66] shadow-sm hover:shadow-md"
              placeholder="e.g., user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C66] shadow-sm hover:shadow-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            onClick={handleSignIn}
            className="w-full bg-[#FF8C66] text-white py-3 rounded-lg hover:bg-[#FF7043] transition-colors font-semibold shadow-md"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <span className="text-gray-400 cursor-not-allowed">Sign up (Coming Soon)</span>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;