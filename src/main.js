const Discord = require('discord.js');
const settings = require('./settings.js');
const pushpin = require('./pushpin.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', pushpin);

client.on('raw', async packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
        return;
    // Grab the channel to check the message from
    const channel = await client.channels.fetch(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id))
        return;
    // Since we have confirmed the message is not cached, let's fetch it
    const message = await channel.messages.fetch(packet.d.message_id);
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.resolve(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction)
        reaction.users.cache.set(packet.d.user_id, await client.users.fetch(packet.d.user_id));
    // Check which type of event it is before emitting
    if (packet.t === 'MESSAGE_REACTION_ADD')
        client.emit('messageReactionAdd', reaction, await client.users.fetch(packet.d.user_id));
    if (packet.t === 'MESSAGE_REACTION_REMOVE')
        client.emit('messageReactionRemove', reaction, await client.users.fetch(packet.d.user_id));
});

client.login(settings.bot_token);