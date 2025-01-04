import { MongoClient } from "mongodb";
import { DATABASE, MONGODB_URI } from "./constants";

const mongoUri = MONGODB_URI;
const dbName = DATABASE;

export const connectDb = async () => {
    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error; 
    }
};
