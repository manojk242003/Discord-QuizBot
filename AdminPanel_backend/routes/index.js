const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Quiz } = require("../db");
const {authMiddleware} = require("../middlewares/middleware")

const signin_input = zod.object({
    username: zod.string(),
    password: zod.string().min(6)
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const parseResult = signin_input.safeParse(body);

    if (!parseResult.success) {
        return res.status(400).json({
            msg: "invalid inputs",
        });
    }

    const user_exist = await User.findOne({
        username: body.username,
        password:body.password
    });
    console.log(user_exist)
    if (user_exist) {
        const token = jwt.sign(
            {
                userId: user_exist._id,
            },
            JWT_SECRET
        );
        return res.status(200).json({
            msg: "signin success",
            token : token
        });
    }
    res.json({
        msg : "user doesn't exist / incorrect username or password "
    })
});

router.get("/getquizzes", async (req, res) => { 
    const quizzes = await Quiz.find();
    res.json(quizzes);
});


router.get("/getquiz/:id", async (req, res) => {    
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
})

router.post("/createquiz",authMiddleware,async (req,res)=>{
    // console.log(req.userId)
    try {
        const newQuiz = new Quiz(req.body);
        await newQuiz.save();
        res.status(201).json(newQuiz)

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post("/addquestion/:id",authMiddleware,async (req,res)=>{
    try
    {   
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);  
        const questionText = req.body.questionText;
        const options = req.body.options;
        quiz.questions.push({questionText,options})
        await quiz.save();
        return res.status(201).json(quiz)
    }
    catch(error)
    {
        res.status(400).json({ message: error.message });
    }
    
})        

router.put("/updatequestion/:id", authMiddleware, async (req, res) => {
    try {
      const quizId = req.params.id;
      const { questionId, questionText, options } = req.body;
  
      // Log request data
      console.log("quizId:", quizId);
      console.log("questionId:", questionId);
      console.log("questionText:", questionText);
      console.log("options:", options);
  
      // Find the quiz by id
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      // Find the question by id in the quiz
      const question = quiz.questions.id(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      // Update the question fields
      question.questionText = questionText || question.questionText; // Keep the old value if null
      question.options = options || question.options; // Keep the old options if null
  
      // Save the updated quiz
      await quiz.save();
  
      res.status(200).json(quiz);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

router.delete("/deletequestion/:id", authMiddleware, async (req, res) => {
    try {
      const quizId = req.params.id;
      const questionId = req.body.questionId;
  
      // Find the quiz by its ID
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      // Check if the question exists within the quiz
      const question = quiz.questions.id(questionId);
  
      if (!question) {
        return res.status(404).json({ message: "Question not found in this quiz" });
      }
  
      // Remove the question using pull
      quiz.questions.pull({ _id: questionId });
      await quiz.save();
  
      res.status(200).json({ message: "Question deleted successfully", quiz });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

router.delete("/deletequiz/:id", authMiddleware, async (req, res) => {
    try {

      const quizId = req.params.id;
      const quiz = await Quiz.findByIdAndDelete(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      res.status(200).json({ message: "Quiz deleted successfully", quiz });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
module.exports = router;