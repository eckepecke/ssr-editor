require('dotenv/config');

let port = process.env.PORT || 8080;

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const http = require('http');

require('./db/database');

const gets = require('./routes/gets');
const index = require('./routes/index');
const posts = require('./routes/posts');
const auth = require('./routes/auth');

const app = express();
const authModel = require('./models/auth');
const initializeSocket = require('./socket');

const server = http.createServer(app);
initializeSocket(server);

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(cors());



// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', index);
app.use('/post', posts);
app.use('/get', gets);
app.use('/auth', auth);
app.use(express.static(path.join(process.cwd(), 'frontend', 'build')));

app.use((req,res, next) => {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

if (process.env.NODE_ENV !== 'test') {
    server.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = { app, server };
