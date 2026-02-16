import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export async function getDb() {
    if (db) {
        return db;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('Missing MONGODB_URI in server/.env');
    }

    const dbName = process.env.MONGODB_DB || 'khushit';
    client = client ?? new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
}
