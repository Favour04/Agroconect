import { Schema, Document, model } from "mongoose"

interface IUser extends Document{
    walletAdress?: string,
    userName?: string,
    email: string,
    password: string,
}

export const userSchema = new Schema<IUser>({
    walletAdress: { type: String, required: true },
    userName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {timestamps: true })


export class User {
    static userModel = model("User", userSchema);
    walletAdress: string = "";
    userName: string = "";
    email: string = "";
    password: string = "";
}

