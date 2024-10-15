import express from 'express';
import database from '../db/database.mjs';
const router = express.Router();

import auth from "../models/auth.js";


router.get('/register', (req, res) => {

    res.render('register');
});

router.get('/login', (req, res) => {

    res.render('login');
});

router.post('/register', (req, res) => auth.register(res, req.body));
router.post('/login', (req, res) => auth.login(res, req.body));

router.get('/', (req, res) => {
    res.redirect('/documentation.html');
});

export default router;

