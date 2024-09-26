import 'dotenv/config'

const port = process.env.PORT || 8080;

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import './db/database.mjs'

import gets from "./routes/gets.js"
import index from "./routes/index.js"
import posts from "./routes/posts.js"

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(cors());

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', index);
app.use('/hello', hello);
app.use('/posts', posts);
app.use('/gets', gets);


app.use((req,res, next) => {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
