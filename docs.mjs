import database from './db/database.mjs'

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
            const result = await collection.insertOne({
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

    getOne: async function getOne(id) {
        let db = await database.getDb();

        try {
            const doc = await db.collection('documents').findOne({ _id: new ObjectId(id) });
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
    }
};

export default docs;
