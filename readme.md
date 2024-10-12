# Discord QuizBot

Discord QuizBot is an interactive bot designed to host quizzes on your Discord server. It allows users to participate in quizzes, track scores, and compete with friends.

## Features
- **Interactive Quizzes**: Host multiple-choice quizzes.
- **Score Tracking**: Keep track of user scores.
- **Leaderboard**: Display top performers.
- **Admin-Only Customization**: Only authorized admins can customize the questions.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/manojk242003/Discord-QuizBot.git
    ```
2. Navigate to the Front-end directory:
    ```bash
    cd Discord-QuizBot/AdminPanel
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Navigate to the Backend directory:
    ```bash
    cd Discord-QuizBot/AdminPanel/backend
    ```
5. Install dependencies:
    ```bash
    npm install
    ```

### Virtual Environment Setup

#### macOS
6. Create a virtual environment and install dependencies:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install discord.py requests pymongo
    ```

#### Windows
6. Create a virtual environment and install dependencies:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    pip install discord.py requests pymongo
    ```

## Usage

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications), create a new Discord bot, and add this bot to your server. Then create a `.env` file and add your Discord bot token:
    ```
    TOKEN=your_token_here
    ```
2. Go to the [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), create a new project and database, and add the connection URL to the `.env` file:
    ```
    MONGO_DB_URL=mongo_db_token
    ```
3. Run the front end in the `AdminPanel` directory:
    ```bash
    npm run dev
    ```
4. Run the backend in the `AdminPanel/backend` directory:
    ```bash
    npx nodemon
    ```
5. From the root directory, run the quizbot:
    ```bash
    python3 quizbot.py
    ```

## Commands

Open the Discord server where you have added the bot and use the following command:
- `wec_quiz`: This command lists the available quizzes to select from. After selecting a quiz, the bot will display questions one by one, giving users 30 seconds to answer each question. Upon completion of the quiz, users can see their rank and the top 10 players of that quiz.

## Video Demo of the task
[Video Demo on Youtube](https://youtu.be/n9tBMIm5SPM)



