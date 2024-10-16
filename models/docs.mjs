import database from '../db/database.mjs'

const docs = {
    getAll: async function getAll(user) {
        let db = await database.getDb();

        try {
            console.log("Trying to fetch documents for user:", user);

            const result = await db.collection.findOne({ email: user });

            console.log(result);

            if (result && result.docs) {
                return result.docs;
            } else {
                return [];
            }
        } catch (error) {
            console.error(e);
            return [];
        } finally {
            await db.client.close()
        }
    },

    addOne: async function addOne(body, user) {
        const { collection, client } = await database.getDb();

        try {
            const result = await collection.updateOne(
                { email: user },
                { 
                  $push: {
                    docs: {
                      id: parseInt(body.id),
                      title: body.title,
                      content: body.content,
                      allowed_users: [user],
                      created_at: new Date()
                    }
                  }
                }
              );

            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    },

    getOne: async function getOne(idString, user) {
        let db = await database.getDb();
        let idToFind = parseInt(idString);

        try {
            const result = await db.collection.findOne({ email: user });
            const docArray = result.docs;

            for (const doc of docArray) {
                if (doc.id === idToFind) {
                    return doc
                } 
            }

            return [];
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

    findHighestID: async function findHighestID(user) {
        let db = await database.getDb();

        try {
            const result = await db.collection.findOne({ email: user });
            const docArray = result.docs;

            console.log(result);
            console.log(docArray);

            let highestId = 0;

            for (const doc of docArray) {
                if (doc.id > highestId) {
                    highestId = doc.id;
                } 
            }

            console.log("checking output")
            console.log(highestId);
  
            return highestId;
        } catch (err) {
            throw new Error('Error finding max id: ' + err.message);
        } finally {
            await db.client.close();
        }
    }
};

export default docs;
