const dotenv = require('dotenv');
const path = require('path');
const Discord = require('discord.js');

dotenv.config({path: path.join(__dirname, '..', '.env')});

const client = new Discord.Client();

function inlineError(promise) {
    return promise.then(v => [null, v], e => [e, null]);
}

async function pinMessage (msg) {
    const [err] = await inlineError(msg.pin({reason: `Message pin requested by user ${msg.author.tag}`}));

    if (err) {
        console.error(err);
        console.error(`Failed to pin message ${msg.id} in channel ${msg.channel.name} requested by ${msg.author.tag}`);
        return;
    }

    console.log(`${msg.author.tag} requested to pin message in ${msg.channel.name}`);
}

async function unpinMessage (msg) {
    const [err] = await inlineError(msg.unpin({ reason: `Message unpinned because user ${msg.author.tag} removed !pin from it` }));

    if (err) {
        console.error(err);
        console.error(`Failed to unpin user's ${msg.author.tag} message ${msg.id} in ${msg.channel.name}`);
        return;
    }

    console.log(`Unpinned user's ${msg.author.tag} message in ${msg.channel.name}`);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (/!pin/.test(msg.content)) pinMessage(msg);
});

client.on('messageUpdate', async msg => {
    let updatedMessage, err;

    [err, updatedMessage] = await inlineError(msg.fetch());

    if (err) {
        console.error(err);
        console.error(`Failed to fetch updated message ${msg.id}`);
        return;
    }

    if (/!pin/.test(updatedMessage.content) && !updatedMessage.pinned && !msg.pinned) return pinMessage(updatedMessage);
    if (/!pin/.test(msg.content) && msg.pinned && !/!pin/.test(updatedMessage.content)) return unpinMessage(updatedMessage);
});

client.login(process.env.DISCORD_LOGIN_TOKEN).catch(e => {
    console.error(e);
    process.exit(1);
});
