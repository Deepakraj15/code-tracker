import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/interfaces";

const userSchema = new Schema<IUser>({
    userAccount: {
        type: "string",
        required: true,
        trim: true,
    },
    id:{
        type: "string",
        required: true,
        trim: true,
    },
});
export const User = mongoose.model<IUser>('User', userSchema);
