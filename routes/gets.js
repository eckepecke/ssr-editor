import express from 'express';
import documents from "../models/docs.mjs";
import auth from "../models/auth.js";


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
    const user = auth.getCurrentUser();

    try {
        const data = await documents.getAll(user);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ success: false });
    }
});

router.get('/add', async (req, res) => {
    const user = auth.getCurrentUser();
    console.log(`Current user is: ${user}`);
    try {
        const lastId = await documents.findHighestID(user);
        console.log(lastId);


        return res.status(200).json({ lastId });
    } catch (error) {
        console.error('Error fetching last id:', error)
        return res.status(500).json({ success: false });
    }
});

router.get('/:id', auth.checkToken, async (req, res) => {
    const user = auth.getCurrentUser();
    console.log(`Current user is: ${user}`);
    console.log(`ID: ${req.params.id}`);

    try {

        const doc = await documents.getOne(req.params.id, user);

        if (!doc || (Array.isArray(doc) && doc.length === 0)) {
            return res.status(404).json({ message: `Doc with id:${req.params.id} does not exist` });
        } else {
            return res.status(200).json({ doc: doc, id: req.params.id });
        }
    } catch(e) {
        console.error(`Something went wrong looking for id:${req.params.id} `, error)
        return res.status(500).json({ success: false });
    }
});

export default router;
