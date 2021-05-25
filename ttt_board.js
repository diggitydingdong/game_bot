function TTTBoard() {
  this.GRID_SIZE = 3;
  this.board = [...Array(this.GRID_SIZE)].map(e => Array(this.GRID_SIZE));
  this.pieceValues = [" ", "X", "O"];

  this.resetBoard = function() {
    for(var y = 0; y < this.GRID_SIZE; y++)
    {
      for(var x = 0; x < this.GRID_SIZE; x++)
      {
        this.board[y][x] = 0;
      }
    }
  }

  this.init = function() {
    this.resetBoard();
  }

  this.getRowAsString = function(row) {
    var output = ""
    var inBetween = " | "

    for(var i = 0; i < this.GRID_SIZE; i++)
    {
      output += this.board[row][i] + (i==this.GRID_SIZE-1 ? "" : inBetween);
    }

    return output;
  }

  this.getBoardAsString = function() {
    var output = ""
    var inBetween = "---+---+---"

    for(var i = 0; i < this.GRID_SIZE; i++)
    {
      output += this.getRowAsString(i) + "\n"
      if(i != this.GRID_SIZE-1) output += inBetween + "\n"
    }

    return output;
  }

  this.placePiece = function(piece, x, y) {
    if(this.board[y][x] !== 0) return false;

    this.board[y][x] = piece;
    return true;
  }

  this.isFull = function() {
    for(var y = 0; y < this.GRID_SIZE; y++)
    {
      for(var x = 0; x < this.GRID_SIZE; x++)
      {
        if(this.board[y][x] === 0) return false;
      }
    }

    return true;
  }

  /*
    0 - still happening
    1/2 - corresponding piece won
    3 - tie
  */
  this.checkBoardState = function() {
    for(var i = 0; i < this.GRID_SIZE; i++)
    {
      if(this.board[i][0] === this.board[i][1] === this.board[i][2] && this.board[i][0] !== 0) return this.board[i][0];

      if(this.board[0][i] === this.board[1][i] === this.board[2][i] && this.board[0][i] !== 0) return this.board[0][i];
    }

    if(this.board[0][0] === this.board[1][1] === this.board[2][2] && this.board[1][1] !== 0) return this.board[1][1];
    if(this.board[0][2] === this.board[1][1] === this.board[2][0] && this.board[1][1] !== 0) return this.board[1][1];

    return this.isFull() ? 3 : 0;
  }
}
