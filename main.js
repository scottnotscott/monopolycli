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
    console.log(chalk.blue('*#######################*'))
    console.log(chalk.green('#--------UHI-ASD--------#'))
    console.log(chalk.green('#-------MONOPOLY--------#'))
    console.log(chalk.yellowBright('#----@scottnotscott-----#'))
    console.log(chalk.yellowBright('#------^-Github-^-------#'))
    console.log(chalk.blue('*#######################*'))

    let players = null;
    let budget = null;

    while (!players) {
        const answer = await readlineSync.question("# of players?\n");
        if(answer < 3){
            players = answer
        } else {
            console.log(chalk.red('Max of two players.'))
        }
    }
    while (!budget) {
        const answerBudget = await readlineSync.question("Player budget?\n");
        let parsedBudget = parseInt(answerBudget)
        if(parsedBudget < 5000) {
            console.log(chalk.red('Budget must be greater than 5000.'))
        }
        if(parsedBudget >= 5000) {
                budget = parsedBudget
        }
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
