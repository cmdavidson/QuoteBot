/*Routing for our server over in app.js*/
const express = require("express");
const router = express.Router();
const quoteLogic = require("./quoteLogic");
/*Make requests to appshare with our bot*/
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const userName = process.env.USERNAME;
const password = process.env.PASSWORD;
const dbUri = process.env.DBURI;
const botID = process.env.BOTID;

function setupConnection() {
    const MongoClient = require("mongodb").MongoClient;
    const uri = `mongodb+srv://${userName}:${password}@${dbUri}/Quotes?retryWrites=true&w=majority"`;
    const client = new MongoClient(uri, {
        useNewUrlParser: true
    });
    return client;
}

/*Set up our route to receive requests*/
router.post("/", function (req, res) {
    var client = setupConnection();
    quoteLogic.runQuoteLogic(client, req.body.text, req.body.sender_type).then((responseText) => {
        console.log("REEEEEEEEEE")
        res.status(200).send();
        if (responseText !== "") {
            var groupmeMessageContent = {
                "bot_id": botID,
                "text": responseText
            };

            //Setup request
            var Request = new XMLHttpRequest();

            Request.open("POST", "https://api.groupme.com/v3/bots/post", false);
            /*Let GroupMe know it's getting json data*/
            Request.setRequestHeader("Content-Type", "application/json");
            /*Gotta use strings, apparently*/
            Request.send(JSON.stringify(groupmeMessageContent));
        }
        client.close()
    });
});

module.exports = router;