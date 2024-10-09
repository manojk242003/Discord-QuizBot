const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb+srv://manojkanumuri007:56347809@cluster0.0ukla.mongodb.net/');
    console.log('MongoDB connected');
} catch (error) {
    console.log('MongoDB connection failed');
    console.log(error);
}

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title of the quiz
    },
    description: {
        type: String,
        required: true, // Description of the quiz
    },
    questions: [{
        questionText: {
            type: String,
            required: true, // The question text
        },
        options: [{
            text: {
                type: String,
                required: true, // Option text
            },
            isCorrect: {
                type: Boolean,
                required: true, // Indicates if the option is correct
            }
        }],
    }],
    createdAt: {
        type: Date,
        default: Date.now, // Creation timestamp
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Last updated timestamp
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:30,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
});

const User = mongoose.model("User",userSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = {
    Quiz,
    User
};
