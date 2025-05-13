import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ViewAllTutorialsAdmin.css';
import axios from 'axios';

const ViewAllTutorials = () => {

  const [tutorials, setTutorials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/api/tutorials')
      .then(response => {
        setTutorials(response.data);
      })
      .catch(error => {
        console.error('Error fetching tutorials:', error);
      });
  }, []);

  const handleAddTutorial = () => {
      navigate('/admin/tutorials/add');
    };

  const handleEdit = (id) => {
    alert(`Edit tutorial ${id}`);
    navigate(`/admin/tutorial-form/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete tutorial ${id}?`)) {
      axios.delete(`http://localhost:8081/api/tutorials/${id}`)
        .then(() => {
          alert(`Tutorial ${id} deleted`);
          setTutorials(prev => prev.filter(t => t._id !== id && t.id !== id));
        })
        .catch(error => {
          console.error('Delete failed:', error);
          alert('Failed to delete tutorial');
        });
    }
  };

  return (
    <div className="tutorials-container">

        <div className="tutorials-header">
          <h2>All Tutorials</h2>
          <button className="add-btn" onClick={handleAddTutorial}>+ Add Tutorial</button>
        </div>

      <table className="tutorials-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutorials.map((tut) => (
            <tr key={tut._id || tut.id}>
              <td>{tut.title}</td>
              <td>{tut.category}</td>
              <td>{tut.estimatedCompletionTime}</td>
              <td>{tut.createdBy}</td>
              <td>{tut.createdAt?.substring(0, 10)}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(tut._id || tut.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(tut._id || tut.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllTutorials;
