import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../axiosConfig';
import Alert from '../components/Alert';

function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    skills: '',
    profileImageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignup) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.bio) {
        newErrors.bio = 'Bio is required';
      }
      if (!formData.skills) {
        newErrors.skills = 'At least one skill is required';
      }
      if (formData.profileImageUrl && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.profileImageUrl)) {
        newErrors.profileImageUrl = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleOAuthRedirect = () => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      setAlert({ message: 'Login successful!', type: 'success' });
      navigate('/posts');
    } else if (error) {
      setAlert({ 
        message: decodeURIComponent(error), 
        type: 'error',
        details: params.get('error_description') 
          ? decodeURIComponent(params.get('error_description'))
          : null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setAlert(null);
    
    try {
      const endpoint = isSignup ? '/api/user/signup' : '/api/user/signin';
      const payload = {
        email: formData.email,
        password: formData.password,
        ...(isSignup && {
          name: formData.name,
          bio: formData.bio,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          profileImageUrl: formData.profileImageUrl
        })
      };
      const response = await api.post(endpoint, payload);
      
      localStorage.setItem('token', response.data.token);
      setAlert({ message: response.data.message, type: 'success' });
      navigate('/posts');
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      let errorDetails = null;
      
      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach(err => {
            serverErrors[err.path] = err.msg;
          });
          setErrors(serverErrors);
          return;
        }
        
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        errorDetails = error.response.data?.details;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setAlert({
        message: errorMessage,
        details: errorDetails,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ email: '', password: '', name: '', bio: '', skills: '', profileImageUrl: '' });
    setAlert(null);
  };

  useEffect(() => {
    handleOAuthRedirect();
  }, [location]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {alert && (
          <Alert 
            message={alert.message} 
            details={alert.details}
            type={alert.type} 
            onClose={() => setAlert(null)} 
          />
        )}
        
        <h1 style={styles.title}>
          Talento
        </h1>
        
        <p style={styles.subtitle}>
          {isSignup ? 'Create your account to share skills' : 'Sign in to your account'}
        </p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <>
              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.name && styles.inputError)
                  }}
                  placeholder="Enter your name"
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="bio" style={styles.label}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.bio && styles.inputError),
                    minHeight: '100px'
                  }}
                  placeholder="Tell us about yourself"
                />
                {errors.bio && <span style={styles.errorText}>{errors.bio}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="skills" style={styles.label}>
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.skills && styles.inputError)
                  }}
                  placeholder="e.g., JavaScript, Python, Design"
                />
                {errors.skills && <span style={styles.errorText}>{errors.skills}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="profileImageUrl" style={styles.label}>
                  Profile Image URL (optional)
                </label>
                <input
                  type="url"
                  id="profileImageUrl"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.profileImageUrl && styles.inputError)
                  }}
                  placeholder="Enter image URL"
                />
                {errors.profileImageUrl && <span style={styles.errorText}>{errors.profileImageUrl}</span>}
              </div>
            </>
          )}
          
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError)
              }}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError)
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>
          
          <button
            type="submit"
            style={isLoading ? {...styles.primaryButton, ...styles.disabledButton} : styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? (
              'Processing...'
            ) : isSignup ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div style={styles.toggleContainer}>
          <button
            onClick={toggleForm}
            style={styles.toggleButton}
          >
            {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
        
        <div style={styles.socialAuthContainer}>
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <div style={styles.dividerText}>Or continue with</div>
            <div style={styles.dividerLine}></div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            style={isLoading ? {...styles.googleButton, ...styles.disabledButton} : styles.googleButton}
            disabled={isLoading}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              style={styles.googleIcon}
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a66c2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '450px',
    width: '100%',
    animation: 'fadeIn 0.6s ease-out',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#0a66c2',
    textAlign: 'center',
    marginBottom: '16px',
    fontFamily: '"Segoe UI", sans-serif',
    letterSpacing: '1px',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  inputError: {
    borderColor: '#e53e3e',
    boxShadow: '0 0 0 1px #e53e3e',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '0.75rem',
    marginTop: '4px',
  },
  primaryButton: {
    backgroundColor: '#0a66c2',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
  },
  disabledButton: {
    opacity: '0.7',
    cursor: 'not-allowed',
  },
  toggleContainer: {
    marginTop: '16px',
    textAlign: 'center',
  },
  toggleButton: {
    color: '#0a66c2',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'all 0.2s',
  },
  socialAuthContainer: {
    marginTop: '24px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  dividerLine: {
    flex: '1',
    height: '1px',
    backgroundColor: '#ddd',
  },
  dividerText: {
    padding: '0 12px',
    color: '#666',
    fontSize: '0.875rem',
  },
  googleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    backgroundColor: 'white',
    color: '#333',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: '500',
    border: '1px solid #ddd',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  }
};

export default AuthScreen;