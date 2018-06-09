const Discord = require('discord.js');
const Token = require('./token.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let con = msg.content;
    if (con.startsWith('!test ')) {
        let str = con.substring('!test '.length, con.length);
        let nickname = msg.guild.member(msg.author).displayName
        msg.channel.send({
            embed: {
                author: {
                    name: nickname,
                    icon_url: msg.author.avatarURL
                },
                timestamp: msg.createdAt,
                color: 3447003,
                description: str
            }
        });
        //msg.delete();
    }
});

client.login(Token.token);