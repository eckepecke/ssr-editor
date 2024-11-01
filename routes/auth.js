const express = require('express');
const database = require("../db/database");
const router = express.Router();
const auth = require("../models/auth");

router.get('/', async (req, res) => {
    return res.status(200).json({
        message: "These are all the current auth routes",
        routes: {
        getDocumentById: {
            method: "POST",
            path: "/register",
            description: "Register user."
        },
        getLastIdForDocCreation: {
            method: "POST",
            path: "/login",
            description: "Login user"
        }
        }
    })
});

router.post('/register', (req, res) => auth.register(res, req.body));
router.post('/login', (req, res) => auth.login(res, req.body));

module.exports = router;

