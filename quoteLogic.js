function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function getQuoteStats(quotes){
    const TOPQUOTECOUNT = 10;
    var quoteCounts = {};
    quotes.forEach((quote) => {
        var quotee = quote.user.toUpperCase();
        if (!(quotee in quoteCounts)) {
            quoteCounts[quotee] = 1
        } else {
            quoteCounts[quotee] = quoteCounts[quotee] + 1;
        }
    });
    
    var quoteStatString = 'TOP QUOTED:\n';
    for (var i = 0; i < TOPQUOTECOUNT; i++){
        var topKey = Object.keys(quoteCounts).reduce((a, b) => { return quoteCounts[a] > quoteCounts[b] ? a: b})
        quoteStatString = quoteStatString + topKey + ": " + quoteCounts[topKey] + "\n";
        delete quoteCounts[topKey];
    }

    return quoteStatString;
}

function getQuoteCount(quotes, quotee){
    quoteeCount = 0;
    quotes.forEach((quote) => {
        if(quote.user.toUpperCase() == quotee.toUpperCase()){
            quoteeCount += 1;
        }
    });

    return (quotee + " currently has " + quoteeCount + " quote(s).");
}

function findBestQuote(quotes, quotee) {
    var quoteeMatches = [];
    var quoteeSubStringOf = [];
    var foundMatch = false;

    quotes.forEach((quote) => {
        if (quote.user.toUpperCase() === quotee.toUpperCase()) {
            foundMatch = true;
            quoteeMatches.push(quote);
        } else if (!foundMatch && quote.user.toUpperCase().includes(quotee.toUpperCase())) {
            quoteeSubStringOf.push(quote);
        }
    });

    if (quoteeMatches.length > 0) {
        numQuotes = quoteeMatches.length;
        chosenQuote = getRandomInt(numQuotes);
        return quoteeMatches[chosenQuote].quote;
    } else if (quoteeSubStringOf.length > 0) {
        numQuotes = quoteeSubStringOf.length;
        chosenQuote = getRandomInt(numQuotes);
        return quoteeSubStringOf[chosenQuote].quote;
    } else {
        var bestQuotes = [];
        var bestSimilarity = 0;
        quotes.forEach((quote) => {
            var CurSim = similarity(quote.user, quotee)
            if (CurSim > bestSimilarity) {
                bestSimilarity = CurSim;
                bestQuotes = [];
                bestQuotes.push(quote);
            } else if (CurSim == bestSimilarity) {
                bestQuotes.push(quote);
            }
        });

        numQuotes = bestQuotes.length;
        chosenQuote = getRandomInt(numQuotes);
        return bestQuotes[chosenQuote].quote;
    }
}

function getQuotesFromDB() {
    return new Promise(function (resolve, reject) {
        collection.find({}).toArray(function (err, quotes) {
            if (err) {
                reject(err);
            } else {
                resolve(quotes);
            }
        });
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function UwU(uwuableString) {
    uwuableString = uwuableString.replace(/l/g, "w");
    uwuableString = uwuableString.replace(/L/g, "W");
    uwuableString = uwuableString.replace(/r/g, "w");
    uwuableString = uwuableString.replace(/R/g, "W");

    return uwuableString;
}

//Cheems logic and comments used taken DIRECTLY from https://cheems.mirazmac.com/?fbclid=IwAR2hsL3CK68FEGEEYFRtH3IDVqPGFC0bsiqJg0jpJlY6eG4K4vuKIp_0x-A
//Thanks, king!
var holyWords = {
    burger: 'burmger',
    bad: 'bamd',
    batman: 'bamtman',
    cheese: 'cheems',
    cheems: 'cheems',
    cheeseburger: 'cheemsburger',
    doge: 'domge',
    female: 'f*male',
    history: 'himstory',
    //Censor gamer words
    nigger: 'n-word', 
    nigga: 'n-word',
    retard: 'remtard',
    woman: 'w*man',
    women: 'w*men',
    walter: 'walmter',
    motherfucker: 'momtherfumcker',
};


function englishToCheems(text) {
    // sorry kimg but no line breakms
    text = text.replace(/(\r\n|\n|\r)/gm, " ");

    // Explode them words
    var words = text.split(" ");
    var cheemedText = [];

    var symbols = [',', '.', ':', '!', '?', '&', '%', '/'];

    for (var i = words.length - 1; i >= 0; i--) {
        // Get rid of extra spaces
        var word = words[i].trim().toLowerCase();

        var needLastCharater = false;

        var lastChar = word.charAt(word.length - 1);

        if (symbols.includes(lastChar)) {
            word = word.slice(0, -1);
            needLastCharater = true;
        }

        // Handle basic plurals
        if (lastChar == 's') {
            var withoutS = word.slice(0, -1);

            if (holyWords[withoutS]) {
                word = holyWords[withoutS] + 's';
                cheemedText[i] = word;
                continue;
            }
        }

        if (holyWords[word]) {
            word = holyWords[word];
        } else {
            word = cheemsAlgorithm(word);
        }

        if (needLastCharater) {
            word = word + lastChar;
        }

        cheemedText[i] = word;
    }


    return cheemedText.join(' ');
}

function cheemsAlgorithm(word) {
    if (word.length < 4) {
        return word;
    }

    var vowels = ['a', 'e', 'i', 'o', 'u'];

    var vowelCount = word.match(/[aeiou]/gi);
    vowelCount = vowelCount === null ? 0 : vowelCount.length;

    var newWord = [];
    var addedM = false;
    var lastChar = word.charAt(word.length - 1);

    for (i = 0; i < word.length; i++) {
        var char = word.charAt(i);

        if (i > 0 && addedM == false) {
            if (vowelCount > 1 && i == 1 && vowels.includes(char) && !vowels.includes(lastChar)) {
                newWord[i] = char;
                continue;
            }

            var prev = word.charAt(i - 1);
            var next = word.charAt(i + 1);

            if (vowels.includes(char) && next != 'm' && prev != 'm' && !vowels.includes(next)) {
                char = char + 'm';

                addedM = true;
            }
        }

        if (newWord[i] == undefined) {
            newWord[i] = char;
        }
    }


    return newWord.join('');
}

function runQuoteLogic(client, reqText, sender_type) {
    return new Promise(function (resolve, reject) {
        if (sender_type === "user") {
            client.connect(err => {
                collection = client.db("Quotes").collection("quote");
                var validText = reqText.replace(/“/g, '"').replace(/”/g, '"').replace(/‘/g, "'").replace(/’/, "'");
                var reqWords = validText.split(" ");
                var reqCommand = reqWords[0];
                switch (reqCommand.toUpperCase()) {
                    case "/QUOTE":
                        //Find quote of specified user, pick random
                        var reqTargetUser = "";
                        if (reqWords.length > 1) { //Multi word user
                            reqTargetUser = validText.substring(reqCommand.length + 1);
                        }
                        if (reqTargetUser) {
                            getQuotesFromDB().then((quotes) => {
                                resolve(findBestQuote(quotes, reqTargetUser));
                            }, function (err) {
                                reject();
                            });
                            //Find all quotes, pick random
                        } else {
                            getQuotesFromDB().then((quotes) => {
                                numQuotes = quotes.length;
                                chosenQuote = getRandomInt(numQuotes);
                                resolve(quotes[chosenQuote].quote);
                            }, function (err) {
                                reject();
                            });
                        }
                        break;
                    case "/QWOTE": //Time for something a little weird and fun....
                        //Find quote of specified user, pick random
                        var reqTargetUser = "";
                        if (reqWords.length > 1) { //Multi word user
                            reqTargetUser = validText.substring(reqCommand.length + 1);
                        }
                        if (reqTargetUser) {
                            getQuotesFromDB().then((quotes) => {
                                resolve(UwU(findBestQuote(quotes, reqTargetUser)));
                            }, function (err) {
                                reject();
                            });
                            //Find all quotes, pick random
                        } else {
                            getQuotesFromDB().then((quotes) => {
                                numQuotes = quotes.length;
                                chosenQuote = getRandomInt(numQuotes);
                                resolve(UwU(quotes[chosenQuote].quote));
                            }, function (err) {
                                reject();
                            });
                        }
                        break;
                    case "/QUOMTE": //Cheems
                        var reqTargetUser = "";
                        if (reqWords.length > 1) { //Multi word user
                            reqTargetUser = validText.substring(reqCommand.length + 1);
                        }
                        if (reqTargetUser) {
                            getQuotesFromDB().then((quotes) => {
                                resolve(englishToCheems(findBestQuote(quotes, reqTargetUser)));
                            }, function (err) {
                                reject();
                            });
                            //Find all quotes, pick random
                        } else {
                            getQuotesFromDB().then((quotes) => {
                                numQuotes = quotes.length;
                                chosenQuote = getRandomInt(numQuotes);
                                resolve(englishToCheems(quotes[chosenQuote].quote));
                            }, function (err) {
                                reject();
                            });
                        }
                        break;
                    case "/QWOMTE": //Real degen hours
                        var reqTargetUser = "";
                        if (reqWords.length > 1) { //Multi word user
                            reqTargetUser = validText.substring(reqCommand.length + 1);
                        }
                        if (reqTargetUser) {
                            getQuotesFromDB().then((quotes) => {
                                resolve(UwU(englishToCheems(findBestQuote(quotes, reqTargetUser))));
                            }, function (err) {
                                reject();
                            });
                            //Find all quotes, pick random
                        } else {
                            getQuotesFromDB().then((quotes) => {
                                numQuotes = quotes.length;
                                chosenQuote = getRandomInt(numQuotes);
                                resolve(UwU(englishToCheems(quotes[chosenQuote].quote)));
                            }, function (err) {
                                reject();
                            });
                        }
                        break;
                    case "/REMOVEQUOTE": //Not yet implemented
                        break;
                    case "/QUOTESTATS":
                        //Find quote of specified user, pick random
                        var reqTargetUser = "";
                        if (reqWords.length > 1) { //Multi word user
                            reqTargetUser = validText.substring(reqCommand.length + 1);
                        }
                        if (reqTargetUser) {
                            getQuotesFromDB().then((quotes) => {
                                resolve(getQuoteCount(quotes, reqTargetUser));
                            }, function (err) {
                                reject();
                            });
                            //Find all quotes, pick random
                        } else {
                            getQuotesFromDB().then((quotes) => {
                                resolve(getQuoteStats(quotes));
                            }, function (err) {
                                reject();
                            });
                        }
                        break;
                    case "/ADDQUOTE":

                        if (reqWords.length < 3) {
                            reject();
                        }

                        var reqTargetUser = "";
                        var reqTargetQuote = "";

                        if (validText.includes('"')) {
                            var quoteIndex = undefined;
                            var endQuoteIndex = undefined;
                            quoteIndex = validText.indexOf('"');
                            endQuoteIndex = validText.substring(quoteIndex).indexOf('"') //Make sure we have a full quote
                            
                            if (endQuoteIndex === -1 || quoteIndex < reqCommand.length + 2) { //Make sure we have end quotes and also that our first quote is in a realistic place
                                reject();
                            }

                            reqTargetUser = validText.substring(reqCommand.length + 1, quoteIndex - 1);
                            reqTargetQuote = validText.substring(quoteIndex + 1, validText.length - 1);

                        } else {
                            reqTargetUser = validText.split(" ")[1];
                            reqTargetQuote = validText.substring(reqTargetUser.length + reqCommand.length + 2);
                        }


                        collection.insertOne({
                            "user": reqTargetUser.toUpperCase(),
                            "quote": ('"' + reqTargetQuote + '" ~' + reqTargetUser)
                        }, function (err, res) {
                            resolve("Saved new quote.");
                        });

                        break;
                }

            });
        } else {
            reject();
        }
    });
}

function getQuoteQueryResults(client, name, quote){
    return new Promise(function (resolve, reject) {
        client.connect(err => {
            if(err) {
                reject(err);
            }
            console.log("test: ", client);
            collection = client.db("Quotes").collection("quote");
            collection.find({"user":{$regex: name.toUpperCase()}, "quote":{$regex: quote}}).toArray(function(err, docs){
                if(err){
                    reject(err);
                }
                resolve(docs);1
            });
        });
    });
}

module.exports.getQuoteQueryResults = getQuoteQueryResults;
module.exports.runQuoteLogic = runQuoteLogic;