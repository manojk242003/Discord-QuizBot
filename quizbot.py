import discord
import requests
import json
from discord.ext import commands
import asyncio

# Define intents
intents = discord.Intents.default()
intents.message_content = True  # Enable access to message content

# Initialize the bot with intents and command prefix
bot = commands.Bot(command_prefix='it!', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

async def get_questions():
    try:
        response = requests.get("http://localhost:5001/api/v1/getquizzes")
        response.raise_for_status()  # Raise an error for bad responses
        json_data = response.json()

        questions = []
        answers = []

        for quiz in json_data:
            if 'questions' not in quiz or not quiz['questions']:
                print(f"No questions found for quiz: {quiz['title']}")
                continue

            for question in quiz['questions']:
                if 'questionText' not in question or 'options' not in question:
                    print(f"Invalid question data received: {question}")
                    continue

                qs = f"**Question:** {question['questionText']}\n"
                correct_answer = 0

                for idx, option in enumerate(question['options'], start=1):
                    qs += f"{idx}. {option['text']}\n"
                    if option.get('isCorrect', False):
                        correct_answer = idx

                questions.append(qs)
                answers.append(correct_answer)

        return questions, answers

    except requests.exceptions.RequestException as e:
        print(f"Error fetching questions: {e}")
        return [], []

@bot.command()  # Define the command here
async def quiz(ctx):
    questions, answers = await get_questions()  # Use the async version of the function
    
    if not questions:
        await ctx.send("Sorry, no valid questions available at the moment.")
        return

    for i, qs in enumerate(questions):
        await ctx.send(qs)
        
        def check(m):
            return m.author == ctx.author and m.content.isdigit()

        try:
            guess = await bot.wait_for('message', check=check, timeout=15.0)
            if int(guess.content) == answers[i]:
                await ctx.send('Correct!')
            else:
                await ctx.send(f'Incorrect. The correct answer was option {answers[i]}')
        except asyncio.TimeoutError:
            await ctx.send(f'Sorry, you took too long. The correct answer was option {answers[i]}')

# Replace 'YOUR_BOT_TOKEN' with your actual bot token
bot.run('MTI5MTQ3MzY1NDYzNDM4NTQ0MA.GY8zY0.o5dqMa9DH4_grL3GRUaQRGRyWgdvb6zAKi3teY')
