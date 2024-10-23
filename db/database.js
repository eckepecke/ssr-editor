require('dotenv/config');
const { MongoClient, ServerApiVersion } = require('mongodb');

const database = {
    getDb: async function getDb () {

        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@ssr-editor.2t5qn.mongodb.net/${process.env.PRODUCTION_DATABASE}?retryWrites=true&w=majority&appName=ssr-editor`;

        if (process.env.NODE_ENV === 'test') {
            console.log("We are testing");
            dsn = "mongodb://localhost:27017/test";
            dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@ssr-editor.2t5qn.mongodb.net/${process.env.TEST_DATABASE}?retryWrites=true&w=majority&appName=ssr-editor`;
        }

        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        const db = await client.db();
        const collection = await db.collection("users");

        return {
            collection: collection,
            client: client,
            db: db
        };
    }
};

module.exports = database;
