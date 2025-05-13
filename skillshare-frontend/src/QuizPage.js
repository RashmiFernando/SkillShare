import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import './QuizPage.css';
import axios from 'axios';

function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8081/api/quizzes/${id}`)
      .then((response) => {
        setQuiz(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Quiz not found.');
        setLoading(false);
      });
  }, [id]);

  const handleOptionChange = (qIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div>
      <Header />
      <div className="quiz-container">
        {loading ? (
          <p>Loading quiz...</p>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            <h2>{quiz.title}</h2>
            {quiz.questions.map((q, index) => (
              <div key={index} className="quiz-question">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                {q.options.map((option) => (
                  <label key={option} className="quiz-option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            {!submitted ? (
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
            ) : (
              <div>
                <div className="result">You scored {score} out of {quiz.questions.length}</div>
                <button className="retake-button" onClick={handleRetake}>Retake Quiz</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default QuizPage;