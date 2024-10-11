import { useEffect, useState } from 'react'
import QuizComponent from './QuizComponent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizMenu = () => {
    const [loggedin, setLoggedin] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLoggedin(true);
        }
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5001/api/v1/getquizzes')
        .then((res) => {
            setQuizzes(res.data)
        })
        .catch((err) => {
            console.log(err)
      })},[loggedin])

    return (
        <div>
            {loggedin ?
                <div className='m-2'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold text-white text-center mt-2 flex-1 ml-[80px]'>
                            Available Quizzes
                        </h2>
                        <button onClick={()=>navigate("/createquiz")}className="bg-blue-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-md ml-4 mr-[85px]">
                            Create Quiz
                        </button>
                    </div>

                    <div>
                        {quizzes.map((quiz) => (
                            <QuizComponent key={quiz._id} quiz={quiz} quizzes={quizzes} setQuizzes={setQuizzes}/>
                        ))} 
                    </div>
                </div>
                : <div>hello</div>}
        </div>
    )
}

export default QuizMenu;
