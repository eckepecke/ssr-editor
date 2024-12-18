const database = require("../db/database");
const hat = require("hat");
const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const auth = {
    token: null,
    user: null,

    getCurrentUser: function getCurrentUser() {
        return auth.user;
    },

    setCurrentUser: function getCurrentUser(user) {
        auth.user = user;
    },

    getCurrentToken: function getCurrentToken() {
        return auth.token;
    },

    setCurrentToken: function getCurrentToken(token) {
        auth.token = token;
    },

    login: async function(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        let db;

        try {
            db = await database.getDb();

            const user = await db.collection.findOne({ email: email });

            if (user) {
                return auth.comparePasswords(
                    res,
                    password,
                    user,
                );
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: function(res, password, user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
                this.token = jwtToken;
                this.user = user.email;

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    },

    register: async function(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let db;

            try {
                db = await database.getDb();

                const existingUser = await db.collection.findOne({ email: email });
                if (existingUser) {
                    return res.status(409).json({
                        errors: {
                            status: 409,
                            source: "/register",
                            title: "User already exists",
                            detail: "A user with this email address already exists."
                        }
                    });
                }

                await db.collection.insertOne({
                    email: email,
                    password: hash,
                    docs: [],
                    collabDocs: [],
                });

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });

            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    checkToken: function(req, res, next) {

        const token = auth.token;

        if (token === null) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }

        jwt.verify(token, jwtSecret, function(err, decoded) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            return next();
        });

    }
};

module.exports = auth;

