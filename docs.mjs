import database from './db/database.mjs'
import { ObjectId } from 'mongodb';


const docs = {
    getAll: async function getAll() {
        let db = await database.getDb();

        try {
            console.log(db);
            return await db.collection.find().toArray();
        } catch (e) {
            console.error(e);

            return [];
        } finally {
            await db.client.close()
        }
    },

    addOne: async function addOne(body) {
        const { collection, client } = await database.getDb();
        console.log("add one triggered")


        try {
            // mongodb generates weird ids, how should we keep track of IDs now?
            // Following guide could be usefule but implementation looks annoying
            // https://www.mongodb.com/resources/products/platform/mongodb-auto-increment
            const result = await collection.insertOne({
                id: parseInt(body.id),
                title: body.title,
                content: body.content,
                created_at: new Date()
            });

            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    },

    getOne: async function getOne(idString) {
        let db = await database.getDb();
        let id = parseInt(idString);
        // have not managed to retrieve document because we dont have id anymore
        
        try {
            const doc = await db.collection.findOne({ _id: new ObjectId(id) });
            return doc;
        } catch (e) {
            console.error(e);
            return {};
        } finally {
            await db.client.close();
        }
    },

    updateOne: async function updateOne(body, id) {
        let db = await openDb();

        try {
            return await db.run(
                `UPDATE documents
                SET title = ?, content = ?
                WHERE id = ?`,
                body.title,
                body.content,
                body.id
            );
        } catch (e) {
            console.error(e);
        } finally {
            await db.close();
        }
    },

    findHighestID: async function findHighestID() {
        let db = await database.getDb();

        try {
            const doc = await db.collection.findOne({}, { sort: { id: -1 }, projection: { id: 1 } });
            return doc ? doc.id : 0;
        } catch (err) {
            throw new Error('Error finding max id: ' + err.message);
        } finally {
            await db.client.close();
        }
    }
};

export default docs;
