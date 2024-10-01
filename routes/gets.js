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
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ success: false });
    }
});

router.get('/add', async (req, res) => {
    try {
        // lastId to be used when adding new document
        const lastId = await documents.findHighestID();
        console.log(lastId);
        return res.status(200).json({ lastId });
    } catch (e) {
        console.error('Error fetching last id:', error)
        return res.status(500).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await documents.getOne(req.params.id);

        if (!doc || (Array.isArray(doc) && doc.length === 0)) {
            // this used to be render add
            return res.status(404).json({ message: `Doc with id:${req.params.id} does not exist` });
        } else {
            console.log("How do I get here also?")
            // this used to be render update
            return res.status(200).json({ doc: doc, id: req.params.id });
        }
    } catch(e) {
        console.error(`Something went wrong looking for id:${req.params.id} `, error)
        return res.status(500).json({ success: false });
    }


});

export default router;
