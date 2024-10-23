const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).json({
        message: "These are all current routes",
        routes: {
            addDocument: {
                method: "POST",
                path: "/post/add",
                description: "Add a new document."
            },
            updateDocument: {
                method: "POST",
                path: "post/update/:id",
                description: "Update an existing document by its ID."
            },
            allDocuments: {
                method: "GET",
                path: "get/all",
                description: "Retrieve all documents."
            },
            getDocumentById: {
                method: "GET",
                path: "get/:id",
                description: "Retrieve a document by its ID."
            }
        },
    });
});

module.exports = router;
