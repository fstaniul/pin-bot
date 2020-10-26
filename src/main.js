const dotenv = require('dotenv');
const path = require('path');
const Discord = require('discord.js');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!/!pinme/.test(msg.content)) return;
    msg.pin({ reason: `Message pin requested by user ${msg.author.tag}` });
});

client.login(process.env.DISCORD_LOGIN_TOKEN);
