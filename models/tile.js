const chalk = require('chalk')

const Player = require('./player')
class Tile {
    constructor(name, price, position, type) {
        this.name = name;
        this.price = price;
        this.position = position;
        this.type = type;
        this.owned = false;
        this.ownedBy = null;
        this.isJail = false;
    }
    getOwned() {
        return this.owned;
    }
    setOwned() {
        return this.owned = true;
    }
    getOwnedBy() {
        return this.ownedBy;
    }
    setOwnedBy(player) {
        this.ownedBy = Player.this.player.getName();
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