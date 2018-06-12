const Discord = require('discord.js');
const Token = require('./token.template.js');
const Resouce = require('./resource.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageReactionAdd", rea => {
    const channel_name = rea.message.channel.name;
    const member = rea.message.member.nickname;

    const channel_id = rea.message.member.id;
    const message_id = rea.message.id;
    const content_id = `https://discordapp.com/channels/${Resouce.server_id}/${channel_id}?junp=${message_id}`;

    if (rea.emoji.name === "📌") {
        rea.message.channel.send(`#${channel_name}`);
        rea.message.channel.send({embed:{
                color:3447003,
                title: "pinned message",
                fields: [{
                    name: `Push Pin!`,
                    value: `#${channel_name}: ${member}`

                }]
            }});
    }
});

client.login(Token.token);