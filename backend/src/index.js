 import express from 'express';
 import consign from 'consign';

 const app = express();

 consign({verbose : true})
    .include('src/libs/config.js')
    .then('src/libs/middlewares.js')
    .then('src/routes')
    .then('src/libs/boot.js')
    .into(app);

module.exports = app;