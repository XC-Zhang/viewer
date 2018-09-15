const express = require("express");
const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(express.static("./public/src"));
} else {
    app.use(express.static("./public/dist"));
}
const server = app.listen(Number(process.env.PORT), () => console.log(`App listening on port ${server.address().port}.`));
module.exports = server;