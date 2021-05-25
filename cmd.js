const helper = require('./helper.js');
var info = require('./info.json');
var help_data = require('./help_data.json');
var ttt = require('./tictactoe.js');
var c4 = require('./c4.js');
var bs = require('./bs.js');
const Discord = require('discord.js');
const fs = require('fs');

/*
  GAME IDEAS:

  - Tic tac toe.
  - Battleship.
  - Mafia.

*/

this.sendHelp = function(channel)
{
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(info.embedColour)
    .setTitle(help_data.title)
    .setFooter(help_data.footer);

  for(var i = 0; i < help_data.categories.length; i++)
  {
    var cat = help_data.categories[i];
    var commands = "";

    for(var j = 0; j < cat.subCommands.length; j++)
    {
      var com = cat.subCommands[j];
      commands += info.prefix;
      if(cat.categoryCommand !== undefined) commands += cat.categoryCommand + " ";
      commands += com.name;
      commands += help_data.inBetween;
      commands += com.description;
      commands += "\n";
    }

    helpEmbed.addField(cat.categoryName, commands);
  }

  channel.send(helpEmbed);
}

this.requestAccess = function(message, client)
{
  var server = client.guilds.cache.get('491238214665764874');
  console.log(server.channels)
  // console.log(server.channels.cache.get('675333548697321483').createInvite().then(
  //   invite => message.channel.send(invite.url)
  // ));
}

this.suggest = function(message) {
  
}

this.handleCommand = function(message, client)
{
  args = helper.getMessageAsArgs(message);
  if(args[0] == "help") this.sendHelp(message.channel);
  else if(args[0] == "invite") message.channel.send(info.invite)
  else if(args[0] == "requestaccess") this.requestAccess(message, client);
  else if(args[0] == "suggest") this.suggest(message);
  else if(args[0] == "ttt") ttt.gameHandler(message);
  else if(args[0] == "c4") c4.gameHandler(message);
  else if(args[0] == "bs") bs.gameHandler(message);
}

this.handleReactionAdd = function(reaction, user)
{
  ttt.onReaction(reaction, user);
  c4.onReaction(reaction, user);
}

this.handleReactionRemove = function(reaction, user)
{
  c4.onReaction(reaction, user);
}
