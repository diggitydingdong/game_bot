// const helper = require('./helper.js');
// const info = require('./info.json');
// const Discord = require('discord.js');

// var gameList = []

// function Game(channel, player1ID, player2ID){
//   this.playerIDs = [player1ID, player2ID];
//   // this.channel = channel;
//   // this.gameID = Math.floor(Math.random()*100000);

//   this.message = undefined;
//   // this.currentTurn = (Math.random() < 0.5) ? 1 : 2;
//   this.gameState = 0;

//   // this.getMessageEmbed = function()
//   // {
//   //   var heading = this.gameState === 0 ? "Current Turn" : "Game Results";
//   //   var field = "It is <@!" + this.playerIDs[this.currentTurn-1] + ">'s turn. [" + (this.board.pieceValues[this.currentTurn]) + "]";

//   //   switch(this.gameState)
//   //   {
//   //     case(1):
//   //     case(2):
//   //       field = "The game has been WON BY <@!" + this.playerIDs[this.gameState-1] + ">! Congratulations!";
//   //       break;
//   //     case(3):
//   //       field = "It was a tie.";
//   //       break;

//   //   }

//   //   const messageEmbed = new Discord.MessageEmbed()
//   //     .setColor(info.embedColour)
//   //     .setTitle("Connect Four")
//   //     .setDescription("" + this.board.getBoardAsString() + "")
//   //     .addField('Players', "<@!" + this.playerIDs[0] + "> v.s. <@!" + this.playerIDs[1] + ">")
//   //     .addField(heading, field)
//   //     .setFooter("Game ID: " + this.gameID);

//   //   return messageEmbed;
//   // }

//   this.init = function()
//   {
//     this.board.init();

//     channel.send(this.getMessageEmbed()).then(sentMessage => {
//       this.message = sentMessage;

//       // Initialise reactions.
//       for(var i = 0; i < this.board.width; i++)
//       {
//         this.message.react(info.connect4Slots[i]);
//       }
//     });
//   }

//   this.updateMessage = function()
//   {
//     this.message.edit(this.getMessageEmbed());
//   }

//   this.onReactionChange = function(reaction, userID)
//   {
//     // slot = info.connect4Slots.indexOf(reaction._emoji.name);
//     // if(slot == -1 || slot >= this.board.width || userID !== this.playerIDs[this.currentTurn-1]) return;
//     // // Valid player making a valid move.
//     // this.makeMove(slot);

//   }
// }

// this.startNewGame = function(message)
// {

// }

// this.gameHandler = function(message)
// {
//   args = helper.getMessageAsArgs(message);

//   switch(args[1])
//   {
//     case("challenge"): /// c4 start @User
//       this.startNewGame(message);
//       break;
//     case("stop"): /// c4 stop <id>
//       this.stopGame(message.channel, args[2], false);
//       break;

//   }
// }
