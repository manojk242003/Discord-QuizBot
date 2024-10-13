import discord
import requests
import json
from discord.ext import commands
import asyncio
import os
import time  # Import the time module
from pymongo import MongoClient

# Define intents
intents = discord.Intents.default()
intents.message_content = True  # Enable access to message content



# Initialize the bot with intents and command prefix
bot = commands.Bot(command_prefix='wec_', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

# Function to fetch quiz questions from the API
async def get_questions(quiz_id):
    try:
        response = requests.get(f"http://localhost:5001/api/v1/getquiz/{quiz_id}")
        response.raise_for_status()  # Raise an error for bad responses
        json_data = response.json()

        questions, answers = [], []

        # Check if the response is a list or a dictionary
        if isinstance(json_data, dict):
            quiz_data = json_data.get('questions', [])
        elif isinstance(json_data, list) and len(json_data) > 0:
            quiz_data = json_data[0].get('questions', [])
        else:
            quiz_data = []

        for question in quiz_data:
            question_text = question.get('questionText')
            options = question.get('options', [])

            if not question_text or not options:
                continue

            qs = f"**Question:** {question_text}\n"
            correct_answer = 0

            for idx, option in enumerate(options, start=1):
                qs += f"{idx}. {option['text']}\n"
                if option.get('isCorrect'):
                    correct_answer = idx

            questions.append(qs)
            answers.append(correct_answer)

        return questions, answers

    except requests.exceptions.RequestException as e:
        print(f"Error fetching questions: {e}")
        return [], []

# Function to fetch available quizzes from the API
async def get_quizzes():
    try:
        response = requests.get("http://localhost:5001/api/v1/getquizzes")
        response.raise_for_status()  # Raise an error for bad responses
        json_data = response.json()

        quizzes = [(quiz['title'], quiz['_id']) for quiz in json_data if 'title' in quiz and '_id' in quiz]
        return quizzes

    except requests.exceptions.RequestException as e:
        print(f"Error fetching quizzes: {e}")
        return []
    
@bot.command()
async def ping(ctx):
    try:
        client = MongoClient(os.getenv("MONGO_DB_URL"))
        # client.admin.command('ping')
        print("MongoDB connection is successful!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")




import os
import time
from pymongo import MongoClient

async def update_leaderboard(username, quiz_id, points, time_taken, length):
    # Calculate average time taken (assuming time_taken is the total time for the quiz)
    avg_time_taken = time_taken / length if length > 0 else 0
    t= time.strftime("%Y-%m-%d %H:%M:%S")
    # Create the new user data
    new_user_data = {
        'date': t,  # Current date and time
        'username': username,
        'points': points,
        'avg_time': avg_time_taken,
    }

    try:
        client = MongoClient(os.getenv("MONGO_DB_URL"))
        client.admin.command('ping')
        print("MongoDB connection is successful!")
        db = client['test']
        collection = db['leaderboard']

        # Check if the quiz already exists in the collection
                # Check if the quiz entry exists in the collection
        leaderboard_entry = collection.find_one({'quiz_id': quiz_id})

        if leaderboard_entry:
            # Check if the user is already on the leaderboard
            # user_entry = next((user for user in leaderboard_entry['users'] if user['username'] == username), None)
            

                # Add the new user to the existing quiz leaderboard
            collection.update_one(
                {'quiz_id': quiz_id},
                    {
                        '$push': {
                            'users': new_user_data
                        }
                    }
            )
        else:
            # Quiz entry does not exist, create a new one with the user data
            new_leaderboard_entry = {
                'quiz_id': quiz_id,
                'users': [new_user_data]  # Initialize with the current user's data
            }
            collection.insert_one(new_leaderboard_entry)


        # Fetch updated users list
        leaderboard_entry = collection.find_one({'quiz_id': quiz_id})
        users = leaderboard_entry['users']

        # Sort by points (desc) and avg_time (asc)
        sorted_users = sorted(users, key=lambda u: (-u['points'], u['avg_time']))

        # Find top 10 players
        top_10_players = sorted_users[:10]

        # Find current user's rank
        user_rank = next((i + 1 for i, user in enumerate(sorted_users) if user['username'] == username and user['date']==t) , None)

        # Display leaderboard
        message = f"Leaderboard for Quiz\n"
        message += f"Top 10 Players:\n"
        for idx, player in enumerate(top_10_players, 1):
            message += f"{idx}. {player['username']} - Points: {player['points']}, Avg Time: {player['avg_time']}\n"

        # Show current user's rank
        message += f"Your Rank: {user_rank}"
        return message

    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")



    

    



# Command to list available quizzes and let the user pick one
@bot.command()
async def quiz(ctx):
    quizzes = await get_quizzes()

    user_name = ctx.author.name
    if not quizzes:
        await ctx.send("Sorry, no valid quizzes available at the moment.")
        return

    # Send the list of quizzes
    await ctx.send(f"Hello {user_name}, here are the available quizzes:")
    numbered_quizzes = "\n".join(f"{idx + 1}. {title}" for idx, (title, _) in enumerate(quizzes))
    await ctx.send(f"{numbered_quizzes}\nEnter the number of the quiz you want to take:")

    # Wait for the user to select a quiz
    def check(m):
        return m.author == ctx.author and m.content.isdigit()
    
    points = 0
    time_taken = 0

    try:
        quiz_no = await bot.wait_for('message', check=check, timeout=30.0)
        quiz_index = int(quiz_no.content) - 1

        if quiz_index < 0 or quiz_index >= len(quizzes):
            await ctx.send("Invalid quiz number selected.")
            return

        selected_quiz_title, selected_quiz_id = quizzes[quiz_index]
        await ctx.send(f"You selected: {selected_quiz_title}")

        # Fetch and present the questions
        questions, answers = await get_questions(selected_quiz_id)
        length = len(questions)  # Correctly get the number of questions

        if not questions:
            await ctx.send("Sorry, no valid questions available for this quiz.")
            return

        for i, qs in enumerate(questions):
            await ctx.send(qs)

            start_time = time.time()  # Record the start time when the question is sent

            def check_answer(m):
                return m.author == ctx.author and m.content.isdigit()

            try:
                guess = await bot.wait_for('message', check=check_answer, timeout=15.0)
                end_time = time.time()  # Record the end time when the user responds

                # Calculate how long the user took to answer
                duration = end_time - start_time
                await ctx.send(f'You took {duration:.2f} seconds to answer.')

                if int(guess.content) == answers[i]:
                    await ctx.send('Correct!')
                    points += 1
                else:
                    await ctx.send(f'Incorrect. The correct answer was option {answers[i]}')

                time_taken += duration
            except asyncio.TimeoutError:
                await ctx.send(f'Sorry, you took too long. The correct answer was option {answers[i]}')
                time_taken += 30.0
        
        await ctx.send(f"Quiz finished\n Points: {points}, Average Time: {time_taken/length if length > 0 else 0}")

        # Call the function to update the leaderboard
        message = await update_leaderboard(ctx.author.name, selected_quiz_id, points, time_taken, length)
        await ctx.send(message)


    except asyncio.TimeoutError:
        await ctx.send("You took too long to select a quiz.")
    except ValueError:
        await ctx.send("Please enter a valid number.")

# Replace 'YOUR_BOT_TOKEN' with your actual bot token
bot.run(os.getenv('TOKEN'))
