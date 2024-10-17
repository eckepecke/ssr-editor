import express from 'express';
import documents from "../models/docs.mjs";
import auth from "../models/auth.js"

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

router.post("/add", auth.checkToken, async (req, res) => {
    const user = auth.getCurrentUser();
    console.log(`we are in post add`);

    console.log(`Current user is: ${user}`);

    try {
        const result = await documents.addOne(req.body, user);

        console.log(result);
        return res.status(201).json({ success: true });
    } catch(e) {
        console.error(e)
        return res.status(500).json({ success: false, message: "Something went wrong adding document" });
    }
});

router.post("/update/doc", auth.checkToken, async (req, res) => {
    try {
        const user = auth.getCurrentUser();
        console.log(`Current user is: ${user}`);
        const result = await documents.updateOne(req.body, user);
        return res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {
                status: 500,
                source: req.path,
                title: "Internal Server Error",
                detail: error.message
            }
        });
    }
});

router.post("/update/access", auth.checkToken, async (req, res) => {

    try {
        const user = auth.getCurrentUser();
        console.log(`Current user is: ${user}`);
        const result = await documents.addAccess(req.body, user);
        return res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {
                status: 500,
                source: req.path,
                title: "Internal Server Error",
                detail: error.message
            }
        });
    }
});


export default router;