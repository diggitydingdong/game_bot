const Discord = require('discord.js');
const client  = new Discord.Client();
const info    = require('./info.json');
var logger    = require('winston');

var cmd    = require('./cmd.js');
var helper = require('./helper.js');

client.once('ready', () => {
  console.log("Ready in " + client.guilds.cache.size);
  console.log(client.guilds.cache.map(g => g.name + " [" + g.id + "]").join("\n"));
  client.user.setActivity(info.prefix + "help - Version " + info.version);
})

client.login(info.token);

client.on('message', message => {
  if(message.author.bot) return;

  // User is executing a game-bot command.
  if(helper.messageMatchPrefix(message))
  {
    cmd.handleCommand(message, client);
  }

});

client.on('messageReactionAdd', (reaction, user) => {
  if(user.bot) return;
  cmd.handleReactionAdd(reaction, user);
});

client.on('messageReactionRemove', (reaction, user) => {
  if(user.bot) return;
  cmd.handleReactionRemove(reaction, user);
});
