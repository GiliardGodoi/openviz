const express = require('express')

const app = express()
module.exports.app = app
exports.app = app

// app.use(require("connect-livereload"));
app.use(express.static('public'))


app.listen(8000, () => {
  console.log('\t\t::: Frontend running at port 8000 :::')
})
