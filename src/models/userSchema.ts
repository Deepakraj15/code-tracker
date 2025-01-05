import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../utils/interfaces";

const userSchema = new Schema<IUser>({
    account: {
        type: { label: String, id: String }, 
        required: true,
        trim: true,
    },
    id: {
        type: String, 
        required: true,
        trim: true,
    },
    premiumUser: {
        type: Boolean,
        required: true,
        default: false,
    },
    accountCreatedAt: {
        type: Date,
        default: new Date(),
    },
    planDetails: {
        type: {subscription:String,price:String},
        default: { subsciption: 'none', price: '0' },
    },
    repoName: {
        type: String,
        required: true,
        default: 'code-tracker-repo',
    }
});
export const User = mongoose.model<IUser>('User', userSchema);