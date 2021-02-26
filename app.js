/*Setup the server and initialize the main handler for group me*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const quote = require("./quote");
/*Use json to parse the body*/
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(bodyParser.json());
/*Use your groupme handler for the server route*/
app.use("/", quote);

app.listen(process.env.PORT || 8080, function () {
    console.log("Example app listening on port 3000!");
});
