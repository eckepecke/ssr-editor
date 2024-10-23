const express = require('express');
const database = require("../db/database");
const router = express.Router();
const auth = require("../models/auth");

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

module.exports = router;

