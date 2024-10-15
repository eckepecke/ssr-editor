import database from "../db/database.mjs";
import hat from "hat";
import validator from "email-validator";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const auth = {

    login: async function(res, body) {
        const email = body.email;
        const password = body.password;
        const apiKey = body.api_key;
        console.log("body in auth.login:")
        console.log(body);


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

            const filter = { key: apiKey, users: {
                $elemMatch: {
                    email: email
                }
            } };

            const user = await db.collection.findOne(filter);

            if (user) {
                return auth.comparePasswords(
                    res,
                    password,
                    user.users[0],
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
                let payload = { api_key: user.apiKey, email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

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

        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)

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
            console.log("hej1");
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

            console.log("hej2");

            let db;



            try {
                console.log("hej3");

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
                    docs: []
                });

                console.log("hej4");

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });

                console.log("hej5");

            } catch (e) {
                console.log("hej6");

                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: e.message
                    }
                });
            } finally {
                console.log("hej7");

                await db.client.close();
            }
        });
    },

    // checkToken: function(req, res, next) {
    //     let token = req.headers['x-access-token'];
    //     let apiKey = req.query.api_key || req.body.api_key;

    //     if (token) {
    //         jwt.verify(token, jwtSecret, function(err, decoded) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     errors: {
    //                         status: 500,
    //                         source: req.path,
    //                         title: "Failed authentication",
    //                         detail: err.message
    //                     }
    //                 });
    //             }

    //             req.user = {};
    //             req.user.api_key = apiKey;
    //             req.user.email = decoded.email;

    //             return next();
    //         });
    //     } else {
    //         return res.status(401).json({
    //             errors: {
    //                 status: 401,
    //                 source: req.path,
    //                 title: "No token",
    //                 detail: "No token provided in request headers"
    //             }
    //         });
    //     }
    // }
};

export default auth;

