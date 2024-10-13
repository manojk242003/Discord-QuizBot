# Discord QuizBot

Discord QuizBot is an interactive bot designed to facilitate fun and engaging quizzes on your Discord server. It allows users to participate in multiple-choice quizzes, track their scores, and compete with friends. The bot also offers a leaderboard to display the top performers and provides admin-only customization options for quiz management.

## Features

- **Interactive Quizzes**: Host multiple-choice quizzes directly within Discord.
- **Score Tracking**: Automatically track user scores for each quiz.
- **Leaderboard**: Showcase the top performers in real-time.
- **Admin Customization**: Only authorized admins can customize quiz questions and settings.

## Installation

Follow these steps to install and set up the Discord QuizBot:

1. Clone the repository:
    ```bash
    git clone https://github.com/manojk242003/Discord-QuizBot.git
    ```

2. Navigate to the frontend directory:
    ```bash
    cd Discord-QuizBot/AdminPanel
    ```

3. Install the frontend dependencies:
    ```bash
    npm install
    ```

4. Navigate to the backend directory:
    ```bash
    cd ../AdminPanel_backend
    ```

5. Install the backend dependencies:
    ```bash
    npm install
    ```

### Virtual Environment Setup

To set up the Python virtual environment and install dependencies:

#### macOS
6. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install discord.py requests pymongo python-dotenv
    ```

#### Windows
6. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    pip install discord.py requests pymongo python-dotenv
    ```

## Usage

1. **Set up your Discord bot**:  
   Go to the [Discord Developer Portal](https://discord.com/developers/applications), create a new bot, and add it to your server. Then, create a `.env` file in the root directory and add your Discord bot token:
    ```
    TOKEN=your_discord_bot_token_here
    ```

2. **Set up MongoDB**:  
   Create a project and database in [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas). Add the MongoDB connection URL to the `.env` file:
    ```
    MONGO_DB_URL=your_mongo_db_url_here
    ```

3. **Run the Frontend**:  
   Start the frontend development server from the `AdminPanel` directory:
    ```bash
    npm run dev
    ```

4. **Run the Backend**:  
   Start the backend server from the `AdminPanel_backend` directory:
    ```bash
    npx nodemon
    ```

5. **Start the QuizBot**:  
   From the root directory, run the quiz bot:
    ```bash
    python3 quizbot.py
    ```

## Commands

Once the bot is running on your Discord server, you can use the following command:

- **`wec_quiz`**:  
   Lists the available quizzes. After selecting a quiz, the bot will display the questions one by one, allowing users 30 seconds to answer each question. Upon quiz completion, users can view their rank and the top 10 players on the leaderboard.

## Admin Panel

A deployed version of the Admin Panel is available in the repository's About section. To sign in, simply click the "Sign In" button; the default username and password are included in the code for demonstration purposes.

## Discord Server

Join the server where the bot is currently active:  
[Discord Server Invite Link](https://discord.gg/u5VTs28A)

## Video Demo

Check out the [video demo](https://youtu.be/n9tBMIm5SPM) for a walkthrough of the bot's features and functionality.

---

This guide walks you through the installation, setup, and usage of the Discord QuizBot, enabling you to seamlessly host quizzes and enhance user interaction in  Discord community!
