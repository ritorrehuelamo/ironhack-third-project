import express from 'express';
import cors from 'cors';

const whiteList = ['http://localhost:4200'];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        const originIsWhiteListed = whiteList.indexOf(origin) !== -1;
        callback(null, originIsWhiteListed);
    },
    credentials: true
}

export class CreateServer {
    app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    loadServerUses(): express.Application {
        this.app.use(cors(corsOptions))
        return this.app;
    }
}