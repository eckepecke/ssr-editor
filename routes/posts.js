import express from 'express';
import documents from "../models/docs.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).json({
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
    try {
        const result = await documents.addOne(req.body);
        console.log(result);
        return res.status(201).json({ success: true });
    } catch(e) {
        console.error(e)
        return res.status(500).json({ success: false, message: "Something went wrong adding document" });
    }
});

router.post("/update/:id", async (req, res) => {
    try {
        const result = await documents.updateOne(req.body);
        return res.status(201).json({ success: true });
    } catch (e) {
        console.error(e)
        return res.status(500).json({ success: false, message: "Something went wrong updating document" });
    }
});


export default router;