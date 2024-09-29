import { MongoClient } from 'mongodb';

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.cqacp.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

let db = null;

const connectDb = async () => {
    if (db) return db;

    const client = new MongoClient(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        db = client.db();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }

    return db;
};

export default connectDb;
