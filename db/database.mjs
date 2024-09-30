import 'dotenv/config';

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {

        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@ssr-editor.2t5qn.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=ssr-editor`;

        if (process.env.NODE_ENV === 'test') {
            console.log("We are testing");
            dsn = "mongodb://localhost:27017/test";
        }

        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        const db = await client.db();
        const collection = await db.collection("documents");

        return {
            collection: collection,
            client: client,
        };
    }
};

export default database;
