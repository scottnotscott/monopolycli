const chalk = require('chalk')

/**
 * TODO: move getOwnedBy and setOwnedBy from here to Game class
 *       since Game class has tile instances
 */
const Player = require('./player')
class Tile {
    constructor(name, price, position, type) {
        this.name = name;
        this.price = price;
        this.position = position;
        this.type = type;
        this.isJail = false;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getPrice() {
        return this.price;
    }
    getPosition() {
        return this.position;
    }
    getType() {
        return this.type;
    }
}

module.exports = Tile;