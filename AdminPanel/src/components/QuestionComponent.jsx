import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const QuestionComponent = ({ quizid,id, questionText, options,quiz,setQuiz }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestionText, setEditedQuestionText] = useState(questionText);
  const [editedOptions, setEditedOptions] = useState(options);

  const edithandler = () => {
    setIsEditing(true);
  };

  const deletehandler = () => {
    // console.log("Delete Question");

    if (window.confirm("Are you sure you want to delete this question?")) {
      axios.delete(`https://discord-quizbot-1.onrender.com/api/v1/deletequestion/${quizid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        questionId: id
      }
      })
      .then((res) => {
      console.log(res.data);
      })
      .catch((err) => {
      console.log(err.response.data.message);
      });

      const updatedQuestions = quiz.questions.filter((question) => question._id !== id);
      setQuiz({ ...quiz, questions: updatedQuestions });
    }
    // const updatedQuestions = quiz.questions.filter((question) => question._id !== id);
    // setQuiz({ ...quiz, questions: updatedQuestions });

  };

  const savehandler = async () => {
    try {
      console.log("Save Question");
      
      // Remove _id from the options
      const optionsWithoutId = editedOptions.map(({ _id, ...rest }) => rest);
  
      // Log the data being sent to the server
      console.log({
        questionId: id,
        questionText: editedQuestionText,
        options: optionsWithoutId
      });
  
      // Validate fields before sending the request
      if (!id || !editedQuestionText || !optionsWithoutId.length) {
        console.error("Missing required fields");
        return;
      }
  
      // Save logic here (e.g., make an API call to save the edited question and options)
      await axios.put('https://discord-quizbot-1.onrender.com/api/v1/updatequestion/' + quizid, {
        questionId: id,
        questionText: editedQuestionText,
        options: optionsWithoutId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log("Question Updated");

      setIsEditing(false);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };
  
  
  

  const cancelhandler = () => {
    // Reset to the initial values if editing is canceled
    setEditedQuestionText(questionText);
    setEditedOptions(options);
    setIsEditing(false);
  };

  const handleQuestionTextChange = (e) => {
    setEditedQuestionText(e.target.value);
    console.log(editedQuestionText)
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    updatedOptions.map((option, i) => {i!==index && (option.isCorrect=false)});
    console.log(updatedOptions)
    setEditedOptions(updatedOptions);
  };

  return (
    <div className="p-6 rounded-lg shadow-md w-full  text-white">
      {/* Question and Options */}
      <div className="bg-black p-4 border rounded-xl">
        <div className="flex items-center justify-between">
          {/* Question Text */}
          <div className='w-full'>
            {isEditing ? (
              <input
                type="text"
                value={editedQuestionText}
                onChange={handleQuestionTextChange}
                className="text-lg font-semibold mb-2 bg-gray-800 text-white p-2 rounded w-full"
              />
            ) : (
              <h3 className="text-lg font-semibold mb-2">{editedQuestionText}</h3>
            )}
          </div>

          {/* Icons aligned to the right */}
          <div className="flex items-center ml-auto space-x-4">
            {isEditing ? (
              <>
                <div onClick={savehandler}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                  </svg>
                </div>
                <div onClick={cancelhandler}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </>
            ) : (
              <div onClick={edithandler}>
                <svg className="h-6 w-6 text-white cursor-pointer" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                  <line x1="16" y1="5" x2="19" y2="8" />
                </svg>
              </div>
            )}
            <div onClick={deletehandler}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
          </div>
        </div>

        {/* Options */}
        {editedOptions.map((option, index) => (
          <div key={option._id} className="flex items-center mb-2">
            {isEditing ? (
              <>
                <input
                  type="radio"
                  checked={option.isCorrect}
                  onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  className="mr-2 bg-gray-800 text-white p-1 rounded"
                />
              </>
            ) : (
              <>
                <input type="checkbox" checked={option.isCorrect} className="mr-2" readOnly />
                <span>{option.text}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

QuestionComponent.propTypes = {
  quizid: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  questionText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired,
    })
  ).isRequired,
  quiz: PropTypes.object.isRequired,
  setQuiz: PropTypes.func.isRequired,
};

export default QuestionComponent;
