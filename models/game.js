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
        const playerId = [
            '0',
            '1',
        ]
        this.ownedTiles = [

        ]
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
        //generate new user id's for each user from array of id's
        console.log('\n')
        console.log(chalk.green('Game started.'))
        // var playerOne = new Player('Scott', 'Cat')
        // var playerTwo = new Player('Molly', 'Boat')
        this.players.forEach(function(idx) {
            this.players.setId(playerId[idx])
        })
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
            if(choice === 'debug') {
                console.log(chalk.blue('========Entering Debug mode========'))
                await this.debug(player)
                answered = false;
                console.log(chalk.blue('========Exiting Debug mode========'))
            }
            // if(answered === false) {
            //     const takeTwo = readlineSync.question('Available Command\n roll :: roll the dice\n');
            //     await this.rollDice(player);
            //     answered = true;
            // }
        }
        await this.setNextTurn() 
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
        let activeTileOwnedBy = this.getOwnedBy();
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
                        this.getOwnedBy();
                        this.setOwnedBy(player);
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
    getOwnedBy(player) {
        let _player = (this.players[this.currentTurn] + 1)
        let _tile = this.players[this.currentTurn].getPosition();
        let isOwned = false
        let purchased = false

        if(!isOwned) {
            if(this.ownedTiles.includes(_player)) {
                isOwned = true;
                return purchased = true;
            }
            if(!this.ownedTiles.includes(_player)) {
                isOwned = false;
                return purchased = false;
            }
            return purchased = false;
        }
    } 
    setOwnedBy(player) {
        let activePlayer = (this.players[this.currentTurn] + 1)
        let _tile = this.players[this.currentTurn].getPosition()
        return this.ownedTiles.push(activePlayer, _tile)

    }
    debug(player) {
        let logUser = this.players[this.currentTurn]
        console.log(chalk.red('======== ' + logUser[0] + ' ======== ' + '<-- logUser'))
        let logTile = this.players[this.currentTurn].getPosition()
        let tileName = this.tiles[player.getPosition()].getName();
        let playerOneId = this.players[0].getId();
        let playerTwoId = this.players[1].getId();
        console.log(chalk.red('======== ' + logTile + ' ======== ' + tileName + ' ======== ' + '<-- logTile'))
        let logOwnedBy = this.getOwnedBy();
        console.log(chalk.red('======== ' + logOwnedBy + ' ======== ' + '<-- logOwnedBy'))
        console.log(chalk.red('======== ' + playerOneId + ' ======== ' + '<-- playerOneId'))
        console.log(chalk.red('======== ' + playerTwoId + ' ======== ' + '<-- playerTwoId'))
        this.getPlayerOne(player);
    }
    getPlayerOne(player) {
        let thePlayerOne = this.players[0]
        console.log(thePlayerOne)
        return thePlayerOne;
    }

}

module.exports = Game;