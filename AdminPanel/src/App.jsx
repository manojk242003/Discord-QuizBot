import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Quiz from "./pages/Quiz"
import QuizCreation from "./pages/QuizCreation"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/createquiz" element={<QuizCreation/>} />

          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
