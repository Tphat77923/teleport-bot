// Description: This file contains the code to get the local commands.
const fs = require('fs');
const getAllfiles = require('./getAllFiles')
const path = require('path');

module.exports = (exceptions = []) => {
    let localCommands = [];
    const commandCategories = getAllfiles(path.join(__dirname, '..', 'commands'),true)

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllfiles(commandCategory)

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile)

            if (exceptions.includes(commandObject.name)) {
                continue;
            }

            localCommands.push(commandObject);
        }
    }

    return localCommands;
}