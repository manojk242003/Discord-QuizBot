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
6.Create a virtual environment go to root directory for macos
  ```bash
      python3 -m venv venv
      source venv/bin/activate      
      pip install discord.py requests pymongo
  ```
  windows
  ```bash
      python -m venv venv
      venv\Scripts\activate
      pip install discord.py requests pymongo
  ```

## Usage

1. Go to this https://discord.com/developers/applications site and create a new discord bot and add this bot to the server,Create a `.env` file and add your Discord bot token:
    ```
    TOKEN=your_token_here
    ```
3. Go to https://www.mongodb.com/products/platform/atlas-database and create a new project and database and add the connection url in .env file
   ```bash
     MONGO_DB_URL = mongo_db_token
   ```
4. run the front end in AdminPanel directory
   ```bash
   npm run dev
   ```
5. run backend in AdminPanel/backend directory
   ```bash
   npx nodemon
   ```
5.In root directory run the quizbot
  ```bash
  python3 quizbot.py
  ```

## Commands
  open the discord server that you have added the bot
- `wec_quiz`: This command gives the list of quizzes to select and after selecting quiz, bot will display the questions one by one for each question user will be having 30s to answer and after the completion of quiz user can be able to see his rank and top 10 players of that quiz



