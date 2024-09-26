import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    return res.json({
        message: "These are all current routes",
        routes: {
            addDocument: {
                method: "POST",
                path: "/add",
                description: "Add a new document."
            },
            updateDocument: {
                method: "POST",
                path: "/update/:id",
                description: "Update an existing document by its ID."
            },
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
        },
    });
});

export default router;
