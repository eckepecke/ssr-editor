import database from '../db/database.mjs'

const docs = {
    getAll: async function getAll(user) {
        let db = await database.getDb();

        try {
            console.log("Trying to fetch documents for user:", user);

            const result = await db.collection.findOne({ email: user });

            if (result && result.docs) {
                let allDocs = result.docs;
                const collabDocs = result.collabDocs;
                console.log("collabDocs:")
                console.log(collabDocs);

                for (const entry of collabDocs) {
                    let docId = entry.docId

                    const tempRes = await db.collection.findOne({ email: entry.owner });
                    const tempResDocs = tempRes.docs;

                    let collabDoc = tempResDocs.find(doc => doc.id === docId);

                    allDocs.push(collabDoc);
                }
                return allDocs;
            } else {
                return [];
            }
        } catch (e) {
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

    updateOne: async function updateOne(body, user) {
        let db = await database.getDb();
        const idToFind = parseInt(body.id)
        console.log(body);

        try {
            const result = await db.collection.findOne({ email: user });
            const docArray = result.docs;
            console.log(docArray);

            const docToUpdate = docArray.find(doc => doc.id === idToFind);

            console.log(`doc to update: ${docToUpdate}`)
            if (docToUpdate) {

                docToUpdate.title = body.title;
                docToUpdate.content = body.content;
                docToUpdate.last_change = new Date();
        
                const result = await db.collection.updateOne(
                    { email: user },
                    { $set: { docs: docArray } }
                );
                console.log(result)

            }

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
    },

    addAccess: async function addAccess(body, user) {
        let db = await database.getDb();
        const idToFind = parseInt(body.id)
        console.log(body);

        try {
            const result = await db.collection.findOne({ email: user });
            const docArray = result.docs;
            const docToUpdate = docArray.find(doc => doc.id === idToFind);

            console.log(`doc to update: ${docToUpdate}`)
            if (docToUpdate) {

                docToUpdate.allowed_users.push(body.newUser);
                docToUpdate.last_change = new Date();

                const result = await db.collection.updateOne(
                    { email: user },
                    { $set: { docs: docArray } }
                );

                const response = await docs.addCollabMap(user, body.id, body.newUser);
                console.log(result)

            }

            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    },

    addCollabMap: async function addCollabMap(owner, docId, collaborator) {
        let db = await database.getDb();

        try {
        const result = await db.collection.findOne({ email: collaborator });

        const newCollab = {
            owner: owner,
            docId: docId,
        }

        const collabArray = result.collabDocs;
        collabArray.push(newCollab);

        const response = await db.collection.updateOne(
            { email: collaborator },
            { $set: { collabDocs: collabArray } }
        );

        return response;
    } catch (e) {
        console.error(e);
    } finally {
        await db.client.close();
    }

    }
};

export default docs;
