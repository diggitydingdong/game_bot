// var logger = require("winston");
const helper = require('./helper.js');
const info = require('./info.json');
const boardSize = 3;
const Discord = require('discord.js');

var gameList = [
  /* Example
  {
    "users": [user1ID, user2ID],
    "board": [
              [0, 0, 0], // 0 represents an empty square.
              [0, 0, 0], // -1 represents an O.
              [0, 0, 0] // 1 represents an X.
            ]
    "currentTurn": user1ID
  }
  */
];

var usersPlaying = [];

this.getTileValue = function (tile)
{
  return tile === 0 ? " " : (tile === 1 ? "X" : "O");
}

// returns an INDEX
this.getGame = function (message)
{
  for(var i = 0; i < gameList.length; i++)
  {
    if(gameList[i].users.includes(message.author.id)) return i;
  }

  return -1;
}


// If rowValue is 3, will return 1. If total is -3, will return -1. If neither, return 0.
this.checkRow = function (rowValue)
{
  return (rowValue == boardSize || rowValue == -boardSize) ? rowValue / boardSize : 0;
}

/*
  Checks the current state of the board. Returns 1 if X has won, -1 if O has won, and 0 if neither have.
*/
this.checkBoardState = function (board)
{
  var total = 0; // used for counting
  for(var i = 0; i < boardSize; i++)
  {
    // Check ith horizontal row.
    total += this.checkRow(board[i][0] + board[i][1] + board[i][2]);

    // Check ith veritcal row.
    total += this.checkRow(board[0][i] + board[1][i] + board[2][i]);
  }

  // Check diagonal rows.
  total += this.checkRow(board[0][0] + board[1][1] + board[2][2]);
  total += this.checkRow(board[0][2] + board[1][1] + board[2][0]);

  return total > 0 ? 1 : (total < 0 ? -1 : 0); // I would just return total but sometimes you can get two rows at once.
}

this.stopGame = function(game, channel, cancelled)
{
  if(game == -1)
  {
    message.channel.send("You are not currently playing a game!");
    return;
  }

  usersPlaying.splice(usersPlaying.indexOf(gameList[game].users[0]));
  usersPlaying.splice(usersPlaying.indexOf(gameList[game].users[1]));
  gameList.splice(game);
  if(cancelled) channel.send("Cancelled your game.");
}

this.sendCurrentTurn = function (game, channel)
{


  if(game == -1)
  {
    channel.send("You are not currently playing a game!");
    return;
  }

  board = gameList[game].board;

  output = "";
  availableSquares = [];

  for(var y = 0; y < boardSize; y++)
  {
    for(var x = 0; x < boardSize; x++)
    {
      output += this.getTileValue(board[y][x]) + (x == boardSize - 1 ? "" : " | ");
      if(board[y][x] == 0) availableSquares.push(y*boardSize + x);
    }
    output += "\n" + (y == boardSize - 1 ? "" : "--+---+--\n");
  }

  turn = gameList[game].turnNumber%2;
  gameList[game].availableSquares = availableSquares;

  var numberOfSpacesLeft = gameList[game].availableSquares.length;
  var heading = '';
  var field = '';
  var doEndGame = true;

  if(this.checkBoardState(gameList[game].board) != 0) // Someone won.
  {
    heading = "Game Results";
    field = "The game has been WON BY <@!" + gameList[game].users[(gameList[game].turnNumber-1)%2] + ">! Congratulations!";
  }
  else if(numberOfSpacesLeft === 0) // Ended in a tie.
  {
    heading = "Game Results";
    field = "The game has ended in a tie.";
  }
  else
  {
    heading = "Current Turn";
    field = "It is <@!" + gameList[game].users[turn] + ">'s turn. [" + (turn == 0 ? "X" : "O") + "]";
    doEndGame = false;
  }

  const boardEmbed = new Discord.MessageEmbed()
    .setColor(info.embedColour)
    .addField('Players', "<@!" + gameList[game].users[0] + "> v.s. <@!" + gameList[game].users[1] + ">")
    .setDescription("```" + output + "```")
    .addField(heading, field);

  channel.send(boardEmbed).then(sentEmbed => {
    var currTurn = -1;
    if(!doEndGame)
    {
      gameList[game].reactMessage = sentEmbed.id;
      currTurn = gameList[game].turnNumber + 0;
    }
    for(var i = 0; i < availableSquares.length && currTurn == gameList[game].turnNumber; i++)
    {
      sentEmbed.react(info.tictactoeArrows[availableSquares[i]]);
    }
  });

  if(doEndGame)
  {
    this.stopGame(game, channel, false);
  }
}

this.startNewGame = function (message)
{
    if(message.mentions.users.first() === undefined)
    {
        message.channel.send("Proper command usage: --ttt start @User");
    }
    else if(usersPlaying.includes(message.author.id))
    {
      message.channel.send("You are already in a game!");
    }
    else if(usersPlaying.includes(message.mentions.users.first().id))
    {
      message.channel.send("The other person is already playing a game.");
    }
    else
    {
      // Add the users to the list of people currently playing.
      usersPlaying.push(message.author.id, message.mentions.users.first().id);

      users = [message.author.id, message.mentions.users.first().id]

      if(Math.random() < 0.5)
      {
        a = users.shift();
        users[1] = a;
      }

      gameList.push({
        "users": users,
        "board": [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        "turnNumber": 0,
        "reactMessage": undefined,
        "availableSquares": []
      });

      this.sendCurrentTurn(this.getGame(message), message.channel);
    }
}

this.makeMove = function(move, game, channel)
{
  gameList[game].board[Math.floor(move/3)][move%3] = gameList[game].turnNumber%2 == 0 ? 1 : -1;
  gameList[game].turnNumber++;
  this.sendCurrentTurn(game, channel)
}

this.onReaction = function(reaction, user)
{
  var move = -1;
  var game = -1;
  for(var i = 0; i < gameList.length; i++)
  {
    // console.log(gameList[i].reactMessage)
    //   console.log(reaction.id)
    if(gameList[i].reactMessage === reaction.message.id)
    {

      if(gameList[i].users[gameList[i].turnNumber%2] != user.id) return;

      move = info.tictactoeArrows.indexOf(reaction._emoji.name);
      if(!gameList[i].availableSquares.includes(move)) return;
      game = i;
      break;
    }
  }
  if(move == -1) return;

  // reaction.message.delete();

  this.makeMove(move, game, reaction.message.channel);
}

this.gameHandler = function (message)
{
  args = helper.getMessageAsArgs(message);
  // ttt start @User#0000

  switch(args[1])
  {
    case("start"):
      this.startNewGame(message);
      break;
    case("view"):
      this.sendCurrentTurn(this.getGame(message), message.channel);
      break;
    case("stop"):
      this.stopGame(this.getGame(message), message.channel, true);
      break;

  }
}
