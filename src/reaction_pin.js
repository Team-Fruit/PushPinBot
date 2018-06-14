const Discord = require('discord.js');
const Token = require('./token.template.js');
const Resource = require('./resource.js');

const client = new Discord.Client();

function Ready() {
    console.log(`Logged in as ${client.user.tag}: caching all recent messages...`);
    let guild;
    let channel;

    for ( guild of client.guilds.values() )
        for ( channel of guild.channels.values() ) {
            const channelName = channel.name;
            if (!channel.fetchMessages) continue;
            channel.fetchMessages({limit: 100})
                .then(messages => {
                    console.log(`Received ${messages.size} messages for #${channelName}`)
                })
                .catch(console.error);
    }
}

function Reaction(rea, user) {
    if (rea.count === 1) {
        const message = rea.message;
        const channel = message.channel;
        const guild   = message.guild;

        if ( channel.name === Resource.target_channel.channel)
            return;
        if ( rea.emoji.name !== "📌")
            return;

        PinMessage(guild, message, user);
    }
}

function PinMessage(guild, message, user) {
    let channel;
    let found;
    for ( channel of guild.channels.values() ) {
        if (channel.name.toLowerCase() !== Resource.target_channel)
            continue;
        if (!channel.send) {
            console.error(`Found channel "${channel.name}", but it's not a text one!`);
            continue;
        }
        found = true;
        break;
    }
    if (!found) {
            console.error(`Can't pin message; can't find channel #${Resource.target_channel}`);
            return;
    }
    let pinMessage = {
        embed: {
            title: "Pinned message!",
            color: 3447003,
            fields: [{
                name: `${user.tag} pinned a message by ${message.author.username}`,
                value: `${message.createdAt.toLocaleString()} : ${message.content}`
            }]
        }
    };
    if (message.author.username !== Resource.bot_name) {
        channel.send(pinMessage)
            .then(_ => console.log(`Pinned ${user.tag} message: ${message.content}`))
            .catch(console.error);
    }
}

client.on("ready", Ready);
client.on("messageReactionAdd", Reaction);

client.login(Token.token);