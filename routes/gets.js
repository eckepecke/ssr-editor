import express from 'express';
import documents from "../models/docs.mjs";

const router = express.Router();


router.get('/', async (req, res) => {
    return res.status(200).json({
        message: "These are all the current get routes",
        allDocuments: {
            method: "GET",
            path: "/all",
            description: "Retrieve all documents."
        },
        getDocumentById: {
            method: "GET",
            path: "/:id",
            description: "Retrieve a document by its ID."
        }
    });
});

router.get('/all', async (req, res) => {
    try {
        const data = await documents.getAll();
        return res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/add', async (req, res) => {
    // const doc = await documents.getOne(req.params.id);
    const lastId = await documents.findHighestID();
    console.log(lastId);


    return res.render("add", { doc: null, id: lastId });
});

router.get('/:id', async (req, res) => {
    console.log("id route");

    const doc = await documents.getOne(req.params.id);
    console.log(doc);


    if (Array.isArray(doc) && doc.length === 0) {
        // Render "add" view if the document is empty array
        return res.render("add", { doc: null, id: req.params.id });
    }

    return res.render("update", { doc });
});

export default router;
