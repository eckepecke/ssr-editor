import 'dotenv/config'

const port = process.env.PORT || 8080;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const docs = await documents.getAll();
    return res.json({ docs });
});

app.get('/:id', async (req, res) => {
    const doc = await documents.getOne(req.params.id);
    if (!doc) {
        return res.status(404).json({ error: "Document not found.", id: req.params.id });
    }
    return res.json({ doc });
});

app.post("/add", async (req, res) => {
    const result = await documents.addOne(req.body);
    return res.status(201).json({ success: true, docID: result.lastID });
});

app.post("/update/:id", async (req, res) => {
    const result = await documents.updateOne(req.body);
    return res.json({ success: true, updatedID: req.params.id });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
