import * as vscode from "vscode";
import { MongoClient } from "mongodb";
import { COLLECTION, DATABASE, MONGODB_URI } from "./utils/constants";
import { User } from "./models/userSchema";
import { IAccount } from "./utils/interfaces";

const mongoUri = MONGODB_URI;
const dbName = DATABASE;
const collectionName = COLLECTION;
const client = new MongoClient(mongoUri);

export const connectDb = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error; 
    }
};

export const closeDb = async () => {
    client.close();
};

export const saveDataToDb = async (account:IAccount) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const newUser = new User({
            id:account.id,
            account:account.label,
        });
        collection.insertOne(newUser);
        vscode.window.showInformationMessage("New User has been created successfully");
    } catch (error) {
        vscode.window.showErrorMessage("Error occured while inserting user");
    }
};
export const fetchUserData = async (data: IAccount) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.findOne(data).then((sample) => {
            console.log(sample);
            return null;
        }).catch((error) => { throw new Error(error); });
        // Return either the result or null
    } catch (error) {
        console.log("Error fetching user data:", error);
        return null;  // Return null if an error occurs
    }
};