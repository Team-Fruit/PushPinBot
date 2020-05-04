const Discord = require('discord.js');
const settings = require('./settings.js');

module.exports = async (reaction, user) => {
    if (reaction.emoji.name !== '📌')
        return;
    if (reaction.count !== 1)
        return;
    const message = reaction.message;
    const guild = message.guild;
    if (message.channel.name === settings.pin_channel.channel)
        return;
    if (message.author.id === guild.me.id)
        return;
    const channel = guild.channels.resolve(settings.pin_channel);
    if (channel === null)
        return;
    const image = message.attachments.first()?.url;
    const pinMessage = new Discord.MessageEmbed()
        .setAuthor(user.username, user.avatarURL({ dynamic: true }))
        .setColor(0xCB3B48)
        .setTitle('📌**Push Pin!**📌')
        .setDescription(`[post](${message.url}) in ${message.channel} by ${message.author}`)
        .addField('──────────────', `${message.content}`, false)
        .setImage(image)
        .setTimestamp(message.editedTimestamp ?? message.createdTimestamp);
    await channel.send(pinMessage).catch(console.error);
    console.log(`Pinned ${user.tag} message: ${message.url}`);
};
