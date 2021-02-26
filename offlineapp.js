//Entry/exit point for offline testing of game logic
//Should contain no game logic itself 

const quoteLogic = require("./quoteLogic");

//lets us use the command line as if it were a groupme input
const readlineSync = require('readline-sync');

function offlineEntryExitPoint(){
    var entryText = "";
    //Gonna need promise shenanigans to make sure this works synchronously
    //loop until we see "stop"
    while(true){
        entryText = readlineSync.question(``);
        if(entryText === "stop") break;
        //create an object with similar structure to a groupme payload to make handling consistent across offline and offline apps

        quoteLogic.runQuoteLogic(entryText, "user").then((responseText) => {
            console.log(responseText);
        });
        
    }
}

//Getting game engine from main handler. TODO: Better way to do this?
offlineEntryExitPoint();