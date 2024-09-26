import express from 'express';
import documents from "../docs.mjs";

const router = express.Router();


router.get('/', async (req, res) => {
    return res.json({
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
    return res.json({
        data: await documents.getAll()
    });
});

router.get('/add', async (req, res) => {
    const doc = await documents.getOne(req.params.id);

    return res.render("add", { doc: null, id: req.params.id });
});

router.get('/:id', async (req, res) => {
    const doc = await documents.getOne(req.params.id);

    if (!doc) {
        // Render "add" view if the document doesn't exist
        return res.render("add", { doc: null, id: req.params.id });
    }

    return res.render("update", { doc });
});

export default router;
