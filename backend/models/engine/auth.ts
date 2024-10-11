import dbconn from "../../connection"
import { DbStorage } from "./db_storage"
import { User } from "../user"
import { hash, genSalt, compare } from "bcryptjs"


type userModel = InstanceType<typeof User.userModel>
interface IAuth {
    register_user(email: string, password: string, role: string): Promise<userModel | null>,
    isvalid_login(email: string, password: string): Promise<boolean>
}

async function __hashpswd(password: string): Promise<string> {
    const salt = await genSalt(10)
    const hashPswd = await hash(password, salt)
    return hashPswd
}

export class Auth implements IAuth {
    
    private db: DbStorage

    constructor() {
       this.db = dbconn
    }

    async register_user(email: string, password: string, role: string): Promise<userModel | null> {
        if (!this.db) {
            throw Error("")
        }
        if (!email && !password && !role) {
            throw Error("missing credentials")
        }

        if (this.db.findUserByEmail(email) != null) {
            throw Error(`User ${email} already exist`)
        }

        // Hash password
        password = await __hashpswd(password)

        // Create new user instance
        const newUser = new User()
        newUser.email = email
        newUser.password = password
        // save user to db
        return await this.db.create(newUser)
    }

    async isvalid_login(email: string, password: string): Promise<boolean> {
        if (!email && !password) {
            throw Error("missing credentials")
        }

        try {
            const user = await this.db.findUserByEmail(email)
            if (user) {
                return await compare(password, user.password) 
            } else {
                throw Error(`user ${email} does not exist`)
            }
        } catch(err) {
            throw err
        }
    }
}