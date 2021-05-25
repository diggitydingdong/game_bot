const helper = require('./helper.js');
const info = require('./info.json');
const Discord = require('discord.js');

const DEFAULT_WIDTH = 8;
const DEFAULT_HEIGHT = 8;

class Ship(size, name, position, dir) {

  constructor() {
    this.size = size;
    this.name = name;
    this.position = position;
    this.dir = dir;
  }


}

class Carrier(position, dir) {
  constructor()
  {
    super(5, "Carrier");
    this.position = position;
    this.dir = dir;
  }
}

class Battleship(position, dir) {
  constructor()
  {
    super(4, "Battleship");
    this.position = position;
    this.dir = dir;
  }
}

class Destroyer(position, dir) {
  constructor()
  {
    super(3, "Destroyer");
    this.position = position;
    this.dir = dir;
  }
}

class Submarine(position, dir) {
  constructor()
  {
    super(3, "Submarine");
    this.position = position;
    this.dir = dir;
  }
}

class PatrolBoat(position, dir) {
  constructor()
  {
    super(2, "Patrol Boat");
    this.position = position;
    this.dir = dir;
  }
}
