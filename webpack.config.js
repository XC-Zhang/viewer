const path = require("path");
const config = {
    mode: "development",
    entry: "./public/src/app.js",
    output: {
        path: path.join(__dirname, "./public/dist"),
        filename: "app.js"
    }
};
module.exports = config