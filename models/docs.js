const database = require("../db/database");
const mailgun = require('mailgun-js');

const docs = {
    getAll: async function getAll(user) {
        let db = await database.getDb();

        try {
            const result = await db.collection.findOne({ email: user });

            if (result && result.docs) {
                let allDocs = result.docs;

                if (result.collabDocs) {
                    const collabDocs = result.collabDocs;

                    allDocs = docs.appendCollabDocs(allDocs, collabDocs);
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
                      is_code: body.isCode,
                      created_at: new Date()
                    }
                  }
                }
              );

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

        try {
            let result = await db.collection.findOne({ email: user });
            let docArray = result.docs;
            const collabDocArray = result.collabDocs;

            let docToUpdate = docArray.find(doc => doc.id === idToFind);
            if (!docToUpdate) {
                const collabDocToUpdate = collabDocArray.find(doc => doc.docId === Number(idToFind));
                if (!collabDocToUpdate) {
                    return { status: 404, error: "Document not found" };
                }

                const owner = collabDocToUpdate.owner;
                result = await db.collection.findOne({ email: owner });
                docArray = result.docs;
                docToUpdate = docArray.find(doc => doc.id === idToFind);
                user = owner;
            }



            docToUpdate.title = body.title;
            docToUpdate.content = body.content;
            docToUpdate.last_change = new Date();

            result = await db.collection.updateOne(
                { email: user },
                { $set: { docs: docArray } }
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

            let highestId = 0;

            for (const doc of docArray) {
                if (doc.id > highestId) {
                    highestId = doc.id;
                } 
            }

            return highestId;
        } catch (err) {
            console.error('Error finding max id:', err);
            return 0;
        } finally {
            await db.client.close();
        }
    },

    addAccess: async function addAccess(body, user) {
        let db = await database.getDb();
        const idToFind = parseInt(body.id)

        try {
            let result = await db.collection.findOne({ email: user });
            const docArray = result.docs;
            const docToUpdate = docArray.find(doc => doc.id === idToFind);
            if (!docToUpdate) {
                return { status: 404, error: "Document not found" };
            }

            docToUpdate.allowed_users.push(body.newUser);
            docToUpdate.last_change = new Date();

            result = await db.collection.updateOne(
                { email: user },
                { $set: { docs: docArray } }
            );

            await docs.addCollabMap(user, body.id, body.newUser);

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
    },

    appendCollabDocs: async function appendCollabDocs(ownerDocs, collabDocs) {
        let db = await database.getDb(); 

        try {
            for (const entry of collabDocs) {
                let docId = entry.docId
                
                const tempRes = await db.collection.findOne({ email: entry.owner });
                const tempResDocs = tempRes.docs;
    
                let collabDoc = tempResDocs.find(doc => doc.id === docId);
    
                ownerDocs.push(collabDoc);
            }
            return ownerDocs;
        } catch(e) {
            console.error(e)
        } finally {
            await db.client.close();
        }
    },

    sendInvite: function sendInvite(user, body) {
        const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN });

        const data = {
            from: user,
            to: 'erikolofsson95@gmail.com',
            // to: body.newUser,
            subject: 'Hello',
            text: `Du har blivit inbjuden av ${user}
             att redigera dokumentet: ${body.title}.
            Om du inte redan har en användare registrera dig på:
            https://jsramverk-eroo23.azurewebsites.net
             Använd mailadressen du fått mailet till vid registrering.`,
        };

        mg.messages().send(data, (error, body) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        })
    }
};

module.exports = docs;
