import { Schema, model } from "mongoose"

interface IUser {
    walletAdress: string,
    userName?: string,
    email?: string,
}

interface UserClsInterface {
    UserSchema:  Schema<IUser>
}

const userSchema = new Schema<IUser>({
    walletAdress: { type: String, required: true },
    userName: { type: String, required: false },
    email: { type: String, required: false },
}, {timestamps: true })


export class User implements IUser {
    static UserSchema = userSchema;
    walletAdress: string = "";
    userName: string = "";
    email: string = "";
}

export default User;