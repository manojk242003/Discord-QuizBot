import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionComponent from '../components/QuestionComponent';
import Navbar from '../components/Navbar';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

const Quiz = () => {
  const { id } = useParams(); // This will extract the id from the URL
  const [quiz, setQuiz] = useState([]);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]); // Array for storing options with text and isCorrect
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get('https://discord-quizbot-1.onrender.com/api/v1/getquiz/' + id)
      .then((res) => {
        console.log(res.data);
        setQuiz(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]); //reload the quiz when id changes

  const addQuestionHandler = () => {
    // Send question and options to the backend
    //validation that atleast one correct option is selected
    if (!options.some((opt) => opt.isCorrect)) {
      setErrorMessage('Please select a correct option');
      return;
    }
    axios.post(
      'https://discord-quizbot-1.onrender.com/api/v1/addquestion/' + id,
      {
        questionText: question,
        options: options // Pass the options array with text and isCorrect
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setQuiz(res.data);
      setOpen(false);   
      setErrorMessage('');
    })
    .catch((err) => {
      console.log(err.response.data.message);
      setErrorMessage(err.response.data.message);
    });

    // Reset form after submitting
    setQuestion('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]);
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][key] = value; // Update either text or isCorrect
    updatedOptions.map((option, i) => {i!==index && (option.isCorrect=false)});
    setOptions(updatedOptions);
  };

  return (
    <div>
      <Navbar />
      <div className="text-white mt-3 p-4 flex justify-between">
        <div>
          <h1 className="text-center text-2xl font-bold">{quiz.title}</h1>
        </div>
        <div>
          <React.Fragment>
            <Button className="text-white" variant="outlined" color="white" onClick={() => setOpen(true)}>
              Add question
            </Button>
            <Modal
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={open}
              onClose={() => setOpen(false)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.8)' // Black background
              }}
            >
              <Sheet
                variant="outlined"
                sx={{
                  maxWidth: 600, // Increased modal size
                  borderRadius: 'md',
                  p: 3,
                  boxShadow: 'lg',
                  backgroundColor: '#1a1a1a' // Dark modal background
                }}
              >
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <Typography
                  component="h2"
                  id="modal-title"
                  level="h4"
                  textColor="white"
                  sx={{ fontWeight: 'lg', mb: 1 }}
                  className="text-center my-2"
                >
                  Add question
                </Typography>
                <form className="flex-col m-6">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Question text"
                      className="input input-primary input-bordered m-2 text-white"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          className="m-2"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        />
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          className="input input-primary input-bordered m-2 text-white"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary m-2"
                      onClick={addQuestionHandler}
                    >
                      Add question
                    </button>
                  </div>
                </form>
                {errorMessage && (
                  <Typography
                    color="danger"
                    sx={{ mt: 2, fontSize: 'sm', textAlign: 'center' }}
                  >
                    {errorMessage}
                  </Typography>
                )}
              </Sheet>
            </Modal>
          </React.Fragment>
        </div>
      </div>
      {quiz.questions &&
        quiz.questions.map((question) => (
          <QuestionComponent
            key={question._id}
            quizid={id}
            id={question._id}
            questionText={question.questionText}
            options={question.options}
            quiz={quiz}
            setQuiz={setQuiz}
          />
        ))}
    </div>
  );
};

export default Quiz;
