import database from '../db/database.mjs'

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

        try {
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

        
        try {
            const doc = await db.collection.findOne({ id: id });
            return doc || [];
        } catch (e) {
            console.error(e);
            return [];
        } finally {
            await db.client.close();
        }
    },

    updateOne: async function updateOne(body) {
        let db = await database.getDb();
        console.log(body);

        try {
            const intID = parseInt(body.id);
            console.log(intID);
            const result = await db.collection.updateOne(
                { id: intID },
                { $set: { title: body.title, content: body.content } }
            );
            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
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
