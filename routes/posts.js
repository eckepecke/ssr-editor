import express from 'express';
import documents from "../models/docs.mjs";
import auth from "../models/auth.js"
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        console.log(`Current document is: ${req.body}`);
        console.log(`Current document is: ${req.body.newUser}`);


        const result = await documents.addAccess(req.body, user);
        // console.log(`SendGrid API Key: ${process.env.SENDGRID_API_KEY}`);


        // const msg = {
        //     to: req.body.newUser,
        //     from: 'eroo23@student.bth.se',
        //     subject: `Invitation to edit document: ${req.body.title}`,
        //     text: `Hello ${req.body.newUser},\n\nYou have been granted access to the document: ${req.body.title} by ${user}.`,
        //     html: `<strong>Hello ${req.body.newUser},</strong><p>You have been granted access to the document: ${req.body.title} by ${user}.</p>`
        // };

        // const response = await sgMail.send(msg);
        // console.log(response);

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