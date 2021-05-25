const helper = require('./helper.js');
const info = require('./info.json');
const Discord = require('discord.js');

const DEFAULT_WIDTH = 7;
const DEFAULT_HEIGHT = 6;

function Board(width, height) {
  this.width = width;
  this.height = height;
  this.board = [...Array(DEFAULT_HEIGHT)].map(e => Array(DEFAULT_WIDTH));
  this.pieceValues = ["<:empty:724098385480777738>", "<:red:724098385220599840>", "<:blue:724098385530847233>"];

  this.resetBoard = function() {
    for(var y = 0; y < height; y++)
    {
      for(var x = 0; x < width; x++)
      {
        this.board[y][x] = 0;
      }
    }
  }

  this.init = function()
  {
    this.resetBoard();
  }

  this.getBoardAsString = function() {
    // "
    //   |               |
    //   |               |
    //   |               |
    //   |     X O       |
    //   |   X O O X     |
    //   | O O X X O     |
    //   +---------------+
    //   | 1 2 3 4 5 6 7 |
    // "

    var output = "";
    //var bottLine = "+";
    //var numLine = "|";
    for(var y = height-1; y >= 0; y--)
    {
      //output += "|";
      for(var x = 0; x < width; x++)
      {
        output += this.pieceValues[this.board[y][x]];
        //bottLine += "--";
        //numLine += " " + (x+1);
      }
      output += "\n";
//      bottLine += "-+\n";
  //    numLine += " |\n";
    }

    return output;
// + bottLine.split("\n")[0] + "\n" + numLine.split("\n")[0];
  }

  // Counts from 1
  this.getHeightOfSlot = function(slot) {
    for(var y = 0; y < this.height; y++)
    {
      if(this.board[y][slot] === 0) return y;
    }

    return this.height;
  }

  this.placePiece = function(slot, piece) {
    if(slot > width) throw Error;

    var slotHeight = this.getHeightOfSlot(slot);

    if(slotHeight === height) return false; // Placement was unsuccessful - not enough room.

    this.board[slotHeight][slot] = piece;

    return true; // Piece was placed.
  }

  this.isFull = function() {
    for(var y = 0; y < this.height; y++)
    {
      for(var x = 0; x < this.width; x++)
      {
        if(this.board[y][x] === 0)
        {
          return false;
        }
      }
    }

    return true;
  }

  /*
    0 - game still in session.
    1 - first player won.
    2 - second player won.
    3 - there's a tie.

    mostRecentSlot - slot of the most recently played piece (from 0-width).
    mostRecentTurn - person who played last (1 or 2)
  */
  this.checkBoardState = function(mostRecentSlot, mostRecentTurn) {
    var piece = {"x": mostRecentSlot, "y": this.getHeightOfSlot(mostRecentSlot)-1};

    // Horizontal
    var horizontalCount = -1; // starts at -1 bc double counts last piece
    for(var x = piece.x; x >=0 && this.board[piece.y][x] === mostRecentTurn; x--)
    {
      horizontalCount++;
    }

    for(var x = piece.x; x < width && this.board[piece.y][x] === mostRecentTurn; x++)
    {
      horizontalCount++;
    }

    if(horizontalCount >= 4) return mostRecentTurn;

    // Vertical
    if(piece.y >= 3)
    {
      for(var count = 0; piece.y - count >= 0 && this.board[piece.y - count][piece.x] === mostRecentTurn; count++)
      {
        if(count >= 3) return mostRecentTurn;
      }
    }

    // Diagonal

    // Negative:
    var negativeGradCount = -1;

    // Left side
    for(var i = 0; piece.y + i < height && piece.x - i >= 0 && this.board[piece.y+i][piece.x-i] === mostRecentTurn; i++)
    {
      negativeGradCount++;
    }
      // Right side
    for(var i = 0; piece.y - i >= 0 && piece.x + i < width && this.board[piece.y-i][piece.x+i] === mostRecentTurn; i++)
    {
      negativeGradCount++;
    }

    if(negativeGradCount >= 4) return mostRecentTurn;

    // Positive:
    var positiveGradCount = -1;

    // Left side
    for(var i = 0; piece.y - i >= 0 && piece.x - i >= 0 && this.board[piece.y-i][piece.x-i] === mostRecentTurn; i++)
    {
      positiveGradCount++;
    }
      // Right side
    for(var i = 0; piece.y + i < height && piece.x + i < width && this.board[piece.y+i][piece.x+i] === mostRecentTurn; i++)
    {
      positiveGradCount++;
    }

    if(positiveGradCount >= 4) return mostRecentTurn;

    return this.isFull() ? 3 : 0;
  }
}

function Game(channel, player1ID, player2ID){
  this.playerIDs = [player1ID, player2ID];
  this.channel = channel;
  this.gameID = Math.floor(Math.random()*1000);

  this.board = new Board(DEFAULT_WIDTH, DEFAULT_HEIGHT);
  this.message = undefined;
  this.currentTurn = (Math.random() < 0.5) ? 1 : 2;
  this.gameState = 0;

  this.getMessageEmbed = function()
  {
    var heading = this.gameState === 0 ? "Current Turn" : "Game Results";
    var field = "It is <@!" + this.playerIDs[this.currentTurn-1] + ">'s turn. [" + (this.board.pieceValues[this.currentTurn]) + "]";

    switch(this.gameState)
    {
      case(1):
      case(2):
        field = "The game has been WON BY <@!" + this.playerIDs[this.gameState-1] + ">! Congratulations!";
        break;
      case(3):
        field = "It was a tie.";
        break;

    }

    const messageEmbed = new Discord.MessageEmbed()
      .setColor(info.embedColour)
      .setTitle("Connect Four")
      .setDescription("" + this.board.getBoardAsString() + "")
      .addField('Players', "<@!" + this.playerIDs[0] + "> v.s. <@!" + this.playerIDs[1] + ">")
      .addField(heading, field)
      .setFooter("Game ID: " + this.gameID);

    return messageEmbed;
  }

  this.init = function()
  {
    this.board.init();

    channel.send(this.getMessageEmbed()).then(sentMessage => {
      this.message = sentMessage;

      // Initialise reactions.
      for(var i = 0; i < this.board.width; i++)
      {
        this.message.react(info.connect4Slots[i]);
      }
    });
  }

  this.updateMessage = function()
  {
    this.message.edit(this.getMessageEmbed());
  }

  this.makeMove = function(slot)
  {
    if(!this.board.placePiece(slot, this.currentTurn)) return; // If it didn't work, just return.

    this.gameState = this.board.checkBoardState(slot, this.currentTurn);
    this.currentTurn = (this.currentTurn === 1 ? 2 : 1);

    this.updateMessage();
  }

  this.onReactionChange = function(reaction, userID)
  {
    slot = info.connect4Slots.indexOf(reaction._emoji.name);
    if(slot == -1 || slot >= this.board.width || userID !== this.playerIDs[this.currentTurn-1]) return;
    // Valid player making a valid move.
    this.makeMove(slot);

  }
}

var gameList = []; // list of games.

this.startNewGame = function(message)
{
  if(message.mentions.users.first() === undefined)
  {
    message.channel.send("You must specify an opponent. Usage: " + info.prefix + "c4 start @User");
    return;
  }

  gameList.push(new Game(message.channel, message.author.id, message.mentions.users.first().id));
  gameList[gameList.length-1].init();
  console.log("Game Started (" + gameList.length + ") by " + message.author.id)
}

this.stopGame = function(channel, id, auto)
{
  if(id === undefined && !auto)
  {
    channel.send("You must specify a game ID (Look in the footer of a game, \"Game ID: <id here>\"). Usage: c4 stop <id>");
    return;
  }

  for(var i = 0; i < gameList.length; i++)
  {
    if(gameList[i].gameID == id)
    {
      gameList.splice(i);
      if(!auto) channel.send("Cancelled the game " + id + ".");
      console.log("Game ended (" + gameList.length + ")")
      return;
    }
  }

  if(!auto) channel.send("Could not find any game with that ID.");
}

this.onReaction = function(reaction, user)
{
  for(var i = 0; i < gameList.length; i++)
  {
    if(gameList[i].message.id === reaction.message.id)// && gameList[i].playerIDs.includes(user.id))
    {
      gameList[i].onReactionChange(reaction, user.id);
      if(gameList[i].gameState !== 0) this.stopGame(gameList[i].channel, gameList[i].gameID, true);
      return;
    }
  }
}

this.gameHandler = function(message)
{
  args = helper.getMessageAsArgs(message);

  switch(args[1])
  {
    case("start"): /// c4 start @User
      this.startNewGame(message);
      break;
    case("stop"): /// c4 stop <id>
      this.stopGame(message.channel, args[2], false);
      break;

  }
}
