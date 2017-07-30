import express from "express";
import bodyparser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

module.exports = (app) => {
    let config = app.src.libs.config;

    app.set('port', config.server_port);
    app.set('json spaces', 4);
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true }));
    
    app.use(compression());
    app.use(cors());
    app.use(express.static('public'));
}