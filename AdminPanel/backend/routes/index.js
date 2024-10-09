const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Quiz } = require("../db");

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

module.exports = router;