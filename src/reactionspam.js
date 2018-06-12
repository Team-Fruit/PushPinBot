const Discord = require('discord.js');
const Token = require('./token.template.js');
const Resource = require('./resource.js');

const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
     for (let i=0, l=Resource.member.length;i<l;i++) {
         if (msg.member.id === Resource.member[i]) {
             msg.react(msg.guild.emojis.get(Resource.emoji[i]))
         }
     }
});

client.login(Token.token);