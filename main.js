const readlineSync = require('readline-sync')
const Player = require('./models/player')
const Game = require('./models/game')
const chalk = require('chalk')

// const playerTest = new Player('Scott', 'Cat')
// console.log('\nName: ', playerTest.getName())
// console.log('Balance: ', playerTest.getBalance())
// console.log('Token: ', playerTest.getToken())
// playerTest.rollDice()

/**
 * todo:
 *      1). add balance checking
 *      2). add tile economy (purchasing, sales)
 *      3). add tile loop when determining position
 *      4). add bankrupt check for end()
 *      5). add banker functionality
 */

async function main() {
    console.log(chalk.green('------ UHI ASD ------'))
    console.log(chalk.blue('------------------'))
    console.log(chalk.green('------ Monopoly CLI ------'))
    console.log(chalk.blue('------------------'))

    let players = null;
    let budget = null;

    while (!players) {
        const answer = await readlineSync.question("# of players?\n");
        players = answer;
    }
    while (!budget) {
        const answer = await readlineSync.question("Player budget?\n");
        budget = answer;
    }

    const Players = [];

    for (let i = 0; i < players; i++) {
        Players.push(new Player(budget));
    }

    const newGame = new Game(Players);

    console.log(chalk.green('------ Game Started ------'));

    await newGame.start();

    process.exit();

}
main();
