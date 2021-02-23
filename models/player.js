const Game = require('./game')

class Player {
    constructor(budget){
        this.balance = budget;
        this.position = 0;

    }

    incrementPosition(position) {
        this.position = this.position + position;
    }
    getBalance() {
        return this.balance;
    }
    setBalance(balance) {
        this.balance -= balance;
    }
    getPosition() {
        return this.position;
    }
    setPosition(position) {
        this.position = position;
    }
    purchaseTile(player) {
    }
}

function tileHandler() {
    return this.tiles[player.getPosition()].getName();
}

module.exports = Player;