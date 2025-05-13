import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorialList.css';
import Header from './Header';
import axios from 'axios';

function TutorialList() {
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

  const handleStartTutorial = (id) => {
    navigate(`/learn/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/api/tutorials/${id}`)
      .then(() => {
        alert('Tutorial deleted');
        setTutorials(prev => prev.filter(t => t.id !== id && t._id !== id));
      })
      .catch(error => {
        console.error('Error deleting tutorial:', error);
        alert('Failed to delete tutorial');
      });
  };

  return (
    <div>
      <Header />
      <div className="tutorial-container">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id || tutorial._id} className="tutorial-card">

            {tutorial.imageUrl && (
              <img
                src={`http://localhost:8081${tutorial.imageUrl}`}
                alt={tutorial.title}
                className="tutorial-image"
              />
            )}
            <h2>{tutorial.title}</h2>
            <p>{tutorial.description}</p>

            {tutorial.steps && tutorial.steps.length > 0 && (
              <>
                <h4>Steps:</h4>
                <ul>
                  {tutorial.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="category-tag">Category: {tutorial.category}</p>
            <button onClick={() => handleStartTutorial(tutorial.id || tutorial._id)}>Start Tutorial</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TutorialList;
