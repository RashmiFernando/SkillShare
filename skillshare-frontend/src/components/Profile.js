import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../axiosConfig';
import Alert from './Alert';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    profileImageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }
      const response = await api.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
        bio: response.data.bio,
        skills: response.data.skills.join(', '),
        profileImageUrl: response.data.profileImageUrl || '',
      });
    } catch (error) {
      setAlert({
        message: 'Failed to load profile. Please try again.',
        type: 'error',
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        profileImageUrl: formData.profileImageUrl,
      };
      const response = await api.put('/api/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...payload });
      setIsEditing(false);
      setAlert({
        message: response.data.message,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'An error occurred while updating your profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      setAlert({
        message: response.data.message,
        type: 'success',
      });
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'An error occurred while deleting your profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleFetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/user/career-roadmap', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmap(response.data.roadmap);
      setShowRoadmap(true);
      setAlert({
        message: 'Career roadmap generated successfully!',
        type: 'success',
      });
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'Failed to generate career roadmap. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profileImageUrl || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          />
          <div className="header-info">
            <h1 className="name">{user.name}</h1>
            <p className="email">{user.email}</p>
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">About</h2>
          {isEditing ? (
            <div className="input-group">
              <label htmlFor="bio" className="label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className={`textarea ${errors.bio ? 'input-error' : ''}`}
                placeholder="Tell us about yourself"
              />
              {errors.bio && <span className="error-text">{errors.bio}</span>}
            </div>
          ) : (
            <p className="text">{user.bio || 'No bio provided'}</p>
          )}
        </div>
        <div className="section">
          <h2 className="section-title">Skills</h2>
          {isEditing ? (
            <div className="input-group">
              <label htmlFor="skills" className="label">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className={`input ${errors.skills ? 'input-error' : ''}`}
                placeholder="e.g., JavaScript, Python, Design"
              />
              {errors.skills && <span className="error-text">{errors.skills}</span>}
            </div>
          ) : (
            <div className="skills-container">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span key={index} className="skill-badge">{skill}</span>
                ))
              ) : (
                <p className="text">No skills listed</p>
              )}
            </div>
          )}
        </div>
        <div className="section">
          <h2 className="section-title">Profile Details</h2>
          {isEditing ? (
            <>
              <div className="input-group">
                <label htmlFor="name" className="label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="profileImageUrl" className="label">Profile Image URL (optional)</label>
                <input
                  type="url"
                  id="profileImageUrl"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  className={`input ${errors.profileImageUrl ? 'input-error' : ''}`}
                  placeholder="Enter image URL"
                />
                {errors.profileImageUrl && <span className="error-text">{errors.profileImageUrl}</span>}
              </div>
            </>
          ) : (
            <div>
              <p className="text"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              <p className="text"><strong>Profile Image:</strong> {user.profileImageUrl ? <a href={user.profileImageUrl} target="_blank" rel="noopener noreferrer">View Image</a> : 'None'}</p>
            </div>
          )}
        </div>
        {showRoadmap && roadmap && (
          <div className="section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faRobot} style={{marginRight: '10px'}} />
              AI-Powered Career Roadmap
            </h2>
            <div className="roadmap-container">
              <div className="roadmap-header">
                <FontAwesomeIcon icon={faRobot} style={{marginRight: '8px'}} />
                AI-Powered Career Roadmap
              </div>
              <pre className="roadmap-text">{roadmap}</pre>
            </div>
            <button
              onClick={() => setShowRoadmap(false)}
              className="button"
              disabled={isLoading}
            >
              Hide Roadmap
            </button>
          </div>
        )}
        <div className="actions">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className={`button ${isLoading ? 'disabled-button' : ''}`}
                disabled={isLoading}
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-button"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="button"
                disabled={isLoading}
              >
                Edit Profile
              </button>
              <button
                onClick={handleFetchRoadmap}
                className="button"
                disabled={isLoading}
              >
                Show Roadmap AI
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-button"
                disabled={isLoading}
              >
                Delete Profile
              </button>
            </>
          )}
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p className="modal-text">Are you sure you want to delete your profile? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className={`modal-button ${isLoading ? 'disabled-button' : ''}`}
                disabled={isLoading}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="modal-cancel-button"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;