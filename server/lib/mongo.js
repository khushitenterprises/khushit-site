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
    if (!client) {
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 8000),
            connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 8000),
            socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 120000)
        });
    }

    try {
        await client.connect();
        const connectedDb = client.db(dbName);
        await connectedDb.command({ ping: 1 });
        db = connectedDb;
        return db;
    } catch (error) {
        client = null;
        db = null;
        throw error;
    }
}
