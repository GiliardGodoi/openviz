const express = require("express");
const app = module.exports.app = exports.app = express();

// app.use(require("connect-livereload"));
app.use(express.static("public"));


app.listen(8000, () => {
    console.log("\t\t::: Frontend running at port 8000 :::");
})