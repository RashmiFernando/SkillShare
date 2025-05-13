import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TutorialForm.css';

const IMAGE_BASE_URL = "http://localhost:8081";

const TutorialForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8081/api/tutorials/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => {
        console.error('Error loading tutorial:', err);
        alert('Tutorial not found.');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleSave = () => {
    axios.put(`http://localhost:8081/api/tutorials/${id}`, formData)
      .then(() => {
        alert('Tutorial updated successfully!');
        navigate(`/admin/tutorials`);
      })
      .catch((err) => {
        console.error('Error updating tutorial:', err);
        alert('Failed to update');
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure to delete this tutorial?')) {
      axios.delete(`http://localhost:8081/api/tutorials/${id}`)
        .then(() => {
          alert('Tutorial deleted');
          navigate(`/admin/tutorials`);
        })
        .catch((err) => {
          console.error('Error deleting tutorial:', err);
          alert('Failed to delete');
        });
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="view-tutorial-form">
      <h2>Edit Tutorial</h2>

      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
      <input type="text" name="estimatedCompletionTime" value={formData.estimatedCompletionTime} onChange={handleChange} placeholder="Estimated Time" />

      <label>Steps</label>
      {formData.steps.map((step, index) => (
        <input
          key={index}
          type="text"
          value={step}
          onChange={(e) => handleArrayChange(index, 'steps', e.target.value)}
          placeholder={`Step ${index + 1}`}
        />
      ))}

      <label>Resources</label>
      {formData.resources.map((res, index) => (
        <input
          key={index}
          type="text"
          value={res}
          onChange={(e) => handleArrayChange(index, 'resources', e.target.value)}
          placeholder={`Resource ${index + 1}`}
        />
      ))}

      <input type="text" name="createdBy" value={formData.createdBy} onChange={handleChange} placeholder="Created By" />
      <input type="datetime-local" name="createdAt" value={formData.createdAt} onChange={handleChange} />

      <input
        type="text"
        name="quizId"
        value={formData.quizId || ''}
        onChange={handleChange}
        placeholder="Quiz ID"
      />


      {formData.imageUrl && (
        <div style={{ marginBottom: '15px' }}>
          <label>Current Image</label>
          <br />
          <img
            src={`${IMAGE_BASE_URL}${formData.imageUrl}`}
            alt="Tutorial"
            style={{ maxWidth: '300px', maxHeight: '200px', marginTop: '10px' }}
          />
        </div>
      )}

      <div className="button-group">
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TutorialForm;
