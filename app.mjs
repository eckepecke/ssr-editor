import 'dotenv/config'

const port = process.env.PORT || 8080;

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import http from 'http';

import './db/database.mjs'

import gets from "./routes/gets.js"
import index from "./routes/index.js"
import posts from "./routes/posts.js"
import auth from "./routes/auth.js";

const app = express();
import authModel from "./models/auth.js";
import initializeSocket from './socket.mjs';

const server = http.createServer(app);
initializeSocket(server);

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(cors());

// app.use(express.static(path.join(process.cwd(), "public")));
// app.use(express.static(path.join(process.cwd(), "frontend")));
app.use(express.static(path.join(process.cwd(), 'frontend', 'build')));



// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.all('*', authModel.checkAPIKey);

app.use('/', index);
app.use('/post', posts);
app.use('/get', gets);
app.use('/auth', auth);



app.use((req,res, next) => {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

server.listen(port, () => console.log(`Server running on port ${port}`));

export default server;