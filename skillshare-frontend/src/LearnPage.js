import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import './LearnPage.css';
import axios from 'axios';

function LearnPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/tutorials/${id}`)
      .then(response => {
        setTutorial(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tutorial:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div><Header /><div className="learn-container"><p>Loading...</p></div></div>;
  }

  if (!tutorial) {
    return (
      <div>
        <Header />
        <div className="learn-container">
          <h2>Tutorial Not Found</h2>
          <p>Sorry, we couldn’t find the tutorial you’re looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="learn-page">
        <div className="main-content">
          <h1>{tutorial.title}</h1>
          <p>{tutorial.description}</p>

          {tutorial.details && (
            <>
              <h3>Details:</h3>
              <p>{tutorial.details}</p>
            </>
          )}

           {tutorial.imageUrl && (
                        <img
                          src={`http://localhost:8081${tutorial.imageUrl}`}
                          alt={tutorial.title}
                          className="tutorial-learn-image"
                        />
           )}

          {tutorial.steps?.length > 0 && (
            <>
              <h3>Steps:</h3>
              <ul>
                {tutorial.steps.map((step, index) => (
                  <li key={index}>{step.label || step}</li>
                ))}
              </ul>
            </>
          )}

          <h3>Category:</h3>
          <p className="category">{tutorial.category}</p>

          {tutorial.resources?.length > 0 && (
            <>
              <h3>Resources:</h3>
              <ul>
                {tutorial.resources.map((res, index) => (
                  <li key={index}>
                    <a href={res.link || res} target="_blank" rel="noopener noreferrer">
                      {res.label || res}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="sidebar">
          <div className="quiz-section">
            <h3>Quiz</h3>
            {tutorial.quizId ? (
              <button
                className="quiz-button"
                onClick={() => navigate(`/quiz/${tutorial.quizId}`)}
              >
                Take Quiz
              </button>
            ) : (
              <p>No quiz available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LearnPage;
