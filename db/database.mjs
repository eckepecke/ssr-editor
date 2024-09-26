import 'dotenv/config';

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {
        // console.log(process.env.DB_PASS);

        let dsn = `mongodb+srv://erik:${process.env.DB_PASS}@ssr-editor.2t5qn.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=ssr-editor`;


        if (process.env.NODE_ENV === 'test') {
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
