const Tile = require('./tile')
const Player = require('./player')
const readlineSync = require('readline-Sync')
const chalk = require('chalk')


class Game {
    constructor(players) {
        this.currentTurn = 0;
        this.players = players;
        //player 2 = uneven
        this.running = false;
        this.tiles = [
            new Tile('Go', 999999999, 0, 'go'),
            new Tile('Mount Ida', 122, 1, 'utility'),
            new Tile('Delos Island', 177, 2, 'land'),
            new Tile('Acheron River', 163, 3, 'utility'),
            new Tile('Ithaca', 631, 4, 'jail'),
            new Tile('Kommos', 6333, 5, 'land'),
            new Tile('Aegina', 2111, 6, 'railroad'),
            new Tile('Mount Lykaion', 6888, 7, 'land'),
            new Tile('Mesatis', 2321, 8, 'railroad'),
            new Tile('Troy', 1231, 9, 'land'),
            new Tile('Ismarus', 3231, 10, 'land'),
            new Tile('Oesyme', 1271, 11, 'railroad'),
            new Tile('Mount Olympus', 1271, 12, 'railroad'),
        ]
    }
    async start() {
        this.running = true;
        console.log('\n')
        console.log(chalk.green('Game started.'))
        // var playerOne = new Player('Scott', 'Cat')
        // var playerTwo = new Player('Molly', 'Boat')
        await this.nextTurn();

    }
    async end() {
        this.running = false;
        console.log('\n')
        console.log(chalk.red('Game ending.'))
        process.exit();
    }

    async nextTurn() {
        const player = this.players[this.currentTurn];
        console.log(chalk.blue(`Player ${this.currentTurn + 1} turn.`))

        /**
         * Player choices table
         */
        let answered;
        const choice = await readlineSync.question('Available Commands\n roll :: roll the dice\n balance :: print balance\n purchase :: purchase tile \n where :: where am I?\n> ');
        if(!answered) {
            if(choice === 'roll') {
                answered = true;
                console.log('\n')
                await this.rollDice(player);
            }
            if(choice === 'balance') {
                console.log(chalk.green(this.printBalance(player) + '\n'))
                answered = false;
            }
            if(choice === 'where') {
                console.log(chalk.green('Current Location: ' + this.tiles[player.getPosition()].getName() + '\n'))
                answered = false;
                
            }
            if(answered === false) {
                const takeTwo = readlineSync.question('Available Command\n roll :: roll the dice\n');
                await this.rollDice(player);
                answered = true;
            }
        }
        await this.setNextTurn();
    }

    async setNextTurn() {
        this.currentTurn = this.currentTurn + 1;
        if (this.currentTurn >= this.players.length) {
            this.currentTurn = 0;
        }

        
        await this.nextTurn();
    }
    async rollDice(player) {
        const dx = Math.floor(Math.random() * 6 + 1)
        const dy = Math.floor(Math.random() * 6 + 1)
        const dt = dx + dy

        console.log(chalk.green(`You rolled a [${dx}] &  [${dy}] \nTotal: ${dt}`))

        if (player.getPosition() + dt >= this.tiles.length) {
            const newPosition = (player.getPosition() + dt) % this.tiles.length;
            player.setPosition(dt);
        } else {
            player.incrementPosition(dt);
        }
        let activeTileName = this.tiles[player.getPosition()].getName();
        let activeTilePrice = this.tiles[player.getPosition()].getPrice();
        let activeTileType = this.tiles[player.getPosition()].getType();
        let activeTileOwnedBy = this.tiles[player.getPosition()].getOwnedBy();
        console.log(chalk.green(`\n----------------\nYou landed on: ${activeTileName}\n ----------------\n`));
        console.log(chalk.green(`\n----------------\n    Priced at: ${activeTilePrice}\n----------------\n`));
        console.log(chalk.green(`\n----------------\n      Of type: ${activeTileType}\n ----------------\n`));
        console.log(chalk.green(`\n----------------\n   Tile Owned: ${activeTileOwnedBy}\n ----------------\n`));
        console.log(chalk.green(`\n----------------------------------------------------------------\n`));
        let reply = false;
        if(!reply) {
            const quiz = await readlineSync.question(`Purchase ${activeTileType} tile: ${activeTileName} for ${activeTilePrice} (y/n)`)
            if(quiz === 'y') {
                let currentBalance = player.getBalance();
                if(!activeTileOwnedBy) {
                    if(activeTilePrice <= currentBalance) {
                        this.tiles[player.getPosition()].setOwnedBy();
                        this.tiles[player.getPosition()].setOwned();
                        console.log(chalk.green(`\n----------------\n   Tile Purchased: ${activeTileName}\n ----------------\n`));
                        reply = true;
                    } else {
                        console.log(chalk.red(`\n----------------\n   Faoled to Purchase: ${activeTileName}\n ----------------\n`))
                        reply = true;
                    }
                }
                if(activeTileOwnedBy) {
                    console.log(chalk.red(`${activeTileName} is owned, purchase failed.`))
                    reply = true;
                }
            }
            if(quiz === 'n') {
                reply = true;
            }
        }
    }
    printBalance(player) {
        const balance = this.players[this.currentTurn].getBalance();
        console.log(chalk.green(`Balance: £${balance}`));
    }
    purchaseTile(player) {
        const playerBalance = player.getBalance();
        let _price = this.tiles[player.getPosition()].getPrice();
        console.log(chalk.red(`DEDUCTING ${_price} from your balance`))
        return player.setBalance(_price)
    }

}

module.exports = Game;