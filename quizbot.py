import discord
import requests
import json
from discord.ext import commands
import asyncio

# Define intents
intents = discord.Intents.default()
intents.message_content = True  # Enable access to message content

# Initialize the bot with intents and command prefix
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

def get_question():
    qs = ''
    id = 1
    answer = 0
    response = requests.get("http://127.0.0.1:8000/api/random/")
    json_data = json.loads(response.text)
    qs += "Question:\n"
    qs += json_data[0]['title'] + "\n"
    for item in json_data[0]['answer']:
        qs += str(id) + ". " + item['answer'] + "\n"
        if item['is_correct']:
            answer = id
        id += 1
    return (qs, answer)

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return
    
    if message.content.startswith('it!quiz'):
        qs, answer = get_question()
        await message.channel.send(qs)

        def check(m):
            return m.author == message.author and m.content.isdigit()
        
        try:
            guess = await bot.wait_for('message', check=check, timeout=5.0)
            if int(guess.content) == answer:
                await message.channel.send('Correct!')
            else:
                await message.channel.send(f'Incorrect. The correct answer was option {answer}')
        except asyncio.TimeoutError:
            await message.channel.send(f'Sorry, you took too long. The correct answer was option {answer}')
    
    await bot.process_commands(message)
    
# Replace 'YOUR_BOT_TOKEN' with your actual bot token
bot.run('MTI5MTQ3MzY1NDYzNDM4NTQ0MA.Glbf0i.jV4TCa4fO2KPyYWwYhPcTXzZOH_hXbl-NcEdyI')
