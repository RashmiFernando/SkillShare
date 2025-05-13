import React, { useState } from 'react';
import axios from 'axios';
import './AddTutorialForm.css';
import { useNavigate } from 'react-router-dom';

const AddTutorialForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    estimatedCompletionTime: '',
    steps: [''],
    resources: [''],
    createdBy: '',
    createdAt: ''
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleArrayChange = (index, field, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Convert formData to JSON string
      const tutorialJson = JSON.stringify(formData);
      formDataToSend.append('tutorial', tutorialJson);

      // Append the image if it exists
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.post('http://localhost:8081/api/tutorials', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Tutorial added successfully!');
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        category: '',
        estimatedCompletionTime: '',
        steps: [''],
        resources: [''],
        createdBy: '',
        createdAt: '',
        quizId: ''
      });
      setImage(null);

      navigate(`/admin/tutorials`);
    } catch (err) {
      console.error('Error adding tutorial:', err);
      alert('Failed to add tutorial. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tutorial-form">
      <h2>Create a New Tutorial</h2>

      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <input type="text" name="estimatedCompletionTime" placeholder="Estimated Time (e.g., 5 days)" value={formData.estimatedCompletionTime} onChange={handleChange} required />

      <label>Steps</label>
      {formData.steps.map((step, i) => (
        <input key={i} type="text" value={step} onChange={(e) => handleArrayChange(i, 'steps', e.target.value)} placeholder={`Step ${i + 1}`} />
      ))}
      <button type="button" onClick={() => addField('steps')}>+ Add Step</button>

      <label>Resources</label>
      {formData.resources.map((res, i) => (
        <input key={i} type="text" value={res} onChange={(e) => handleArrayChange(i, 'resources', e.target.value)} placeholder={`Resource ${i + 1}`} />
      ))}
      <button type="button" onClick={() => addField('resources')}>+ Add Resource</button>

      <input type="text" name="createdBy" placeholder="Created By" value={formData.createdBy} onChange={handleChange} required />
      <input type="datetime-local" name="createdAt" value={formData.createdAt} onChange={handleChange} required />

      <input
        type="text"
        name="quizId"
        placeholder="Quiz ID"
        value={formData.quizId}
        onChange={handleChange}
      />

      <label>Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
          <p>{image.name}</p>
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Tutorial'}
      </button>
    </form>
  );
};

export default AddTutorialForm;