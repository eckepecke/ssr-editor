const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).json({
        message: "This is the index route. Contionue to sub index routes for more info.",
        routes: {
            postRoutes: {
                method: "GET",
                path: "/post",
                description: "Get info on /post routes."
            },
            allDocuments: {
                method: "GET",
                path: "/get",
                description: "Get info on /get routes."
            },
            getDocumentById: {
                method: "GET",
                path: "/auths",
                description: "Get info on /auth routes."
            }
        },
    });
});

module.exports = router;
