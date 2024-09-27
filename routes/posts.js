import express from 'express';
// flytta till models?
import documents from "../docs.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    return res.json({
        message: "These are all current post routes",
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
            }
        }
    });
});

router.post("/add", async (req, res) => {
    console.log("ADD ROUTE");
    const result = await documents.addOne(req.body);
    console.log(result);
    return res.status(201).json({ success: true });
});

router.post("/update/:id", async (req, res) => {

    const result = await documents.updateOne(req.body);
    return res.status(201).json({ success: true });
});


export default router;