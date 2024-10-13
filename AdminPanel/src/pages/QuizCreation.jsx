import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const QuizCreatorForm = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);
  const navigate = useNavigate();

  // Handle input for quiz title
  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  // Handle question text input
  const handleQuestionTextChange = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = text;
    setQuestions(updatedQuestions);
  };

  // Handle option text input
  const handleOptionTextChange = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(updatedQuestions);
  };

  // Set correct option for a question
  const setCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.map(
      (opt, idx) => ({ ...opt, isCorrect: idx === optionIndex })
    );
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  // Delete a question
  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle form submission (e.g., log or send to an API)
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://discord-quizbot-1.onrender.com/api/v1/createquiz", {
        title: quizTitle,
        description: description,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then((response) => {
        console.log('Quiz created:', response)
        toast.success('Quiz created successfully!');
        setTimeout(() => {
          navigate('/');
        },5000)
      })
      .catch((error) => console.error('Error creating quiz:', error));

    

  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-900 text-white p-5">
        <ToastContainer />
      <h1 className="text-3xl font-bold mb-5">Create a New Quiz</h1>

      {/* Quiz Title Input */}
      <input
        type="text"
        value={quizTitle}
        onChange={handleQuizTitleChange}
        placeholder="Enter Quiz Title"
        className="w-full bg-gray-800 p-3 rounded mb-5 text-white"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Quiz Description"
        className="w-full bg-gray-800 p-3 rounded mb-5 text-white"
      />

      {/* Questions Form */}
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="border border-gray-700 p-4 rounded-lg mb-5">
            {/* Question Text Input */}
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
              placeholder={`Enter Question ${index + 1}`}
              className="w-full bg-gray-800 p-2 rounded mb-3 text-white"
            />

            {/* Options for the Question */}
            {question.options.map((option, optIdx) => (
              <div key={optIdx} className="flex items-center mb-2">
                <input
                  type="radio"
                  checked={option.isCorrect}
                  onChange={() => setCorrectOption(index, optIdx)}
                  className="mr-3"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(index, optIdx, e.target.value)}
                  placeholder={`Option ${optIdx + 1}`}
                  className="w-full bg-gray-800 p-2 rounded text-white"
                />
              </div>
            ))}

            {/* Delete Question Button */}
            <button
              type="button"
              onClick={() => deleteQuestion(index)}
              className="text-red-500 hover:text-red-300 mt-3"
            >
              Delete Question
            </button>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
        >
          Add Question
        </button>

        {/* Submit Quiz Button */}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded ml-3 hover:bg-green-400"
        >
          Submit Quiz
        </button>
      </form>
    </div>
    </>
  );
};

export default QuizCreatorForm;
