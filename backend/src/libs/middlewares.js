import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';

module.exports = (app) => {
    let config = app.src.libs.config;

    app.set('port', config.server_port);
    app.set('json spaces', 4);

    app.use(cors());

    app.use(bodyParser.json());

    app.use(express.static('public'));
}