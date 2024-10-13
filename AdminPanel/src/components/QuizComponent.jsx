import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuizComponent = ({ quiz, quizzes, setQuizzes }) => {

    const navigate = useNavigate();

    const deleteQuizHandler = () => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            console.log("Delete Quiz");
            console.log(quiz._id);
            
            axios.delete(`https://discord-quizbot-1.onrender.com/api/v1/deletequiz/${quiz._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                console.log(res.data);
                // Update quizzes state after successful deletion
                const updatedQuizzes = quizzes.filter((q) => q._id !== quiz._id);
                setQuizzes(updatedQuizzes);
            })
            .catch((err) => {
                console.log(err.response.data.message);
            });
        }
    }

    return (
        <div className="w-[90%] mx-auto my-4 p-6 rounded-lg shadow-md border-2 border-gray-500 bg-black">
            <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="mb-4 sm:mb-0 flex-grow">
                    <button className="text-xl sm:text-2xl font-bold text-white cursor-pointer" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                        {quiz.title}
                    </button>
                    <p className="text-md sm:text-lg text-white">{quiz.description}</p>
                </div>
                <div className="flex-shrink-0 self-start">
                    <button onClick={deleteQuizHandler} className="bg-blue-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-md">
                        Delete Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

QuizComponent.propTypes = {
    quiz: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
    }).isRequired,
    setQuizzes: PropTypes.func.isRequired,
    quizzes: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
    })).isRequired,
};

export default QuizComponent;
