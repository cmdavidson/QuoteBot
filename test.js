const ObjectID = require('mongodb').ObjectId;

let test = [{_id:"123123123123", quote: "asdadadadasd"}, {id:"5434532242", quote: "gsdfsdfsdfdsf"}];


for(doc in test){
    timestampedDoc = doc;
    docTimestamp = ObjectID(doc._id).getTimestamp();
    timestampedDoc.timestamp = docTimestamp;
    test[doc] = timestampedDoc;
}

console.log(test)