import { Connection, model, Document, createConnection, Schema } from 'mongoose';
import { User } from "../user"

// Todo: all type should later be transfer to a filer called types.ts	
type ClassInstances = User
type Models = InstanceType<typeof User.userModel> 

interface DbStorageInterface {
    connectionFactory(uri: string): Promise<void>,
    create(obj: ClassInstances): Promise<Models | null>,
    get(cls: string, id: string): Promise<Models | null>,
    delete(cls:string, id: string): Promise<void>,
    findUserByWalletId(walletAdress: string): Promise<Models | null>,
    findUserByEmail(email: string): Promise<Models | null>,
    update(cls: string, id: string, ...args: Array<Object>): Promise<void>
}


export class DbStorage implements DbStorageInterface {
    private connection: Connection | null = null;

    async connectionFactory(uri: string): Promise<void> {
        if (!this.connection) {
            try {
                const conn = await createConnection(uri);
                conn.model("User", User.userModel.schema);
                this.connection = conn
            } catch(err) {
                console.error('Failed to connect to MongoDB:', err);
                throw new Error('MongoDB connection failed');
            }
        } 
    }

    async create(obj: ClassInstances): Promise<Models | null> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }

        const Model = this.connection.models[obj.constructor.name];

        if (!Model) {
            throw new Error(`Model ${obj.constructor.name} not found.`);
        }

        const newObj = new Model(obj)
        const savedObj = await newObj.save()
        return savedObj
    }

    async get(cls: string, id: string): Promise<Models | null> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }

        const Model = this.connection.models[cls]
        
        if(!Model) {
            throw new Error(`Model ${cls} not found.`);
        } 

        const doc = await Model.findById(id)
        return doc
    }

    async delete(cls: string, id: string): Promise<void> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        
        const Model = this.connection.models[cls]
        
        if(!Model) {
            throw new Error(`Model ${cls} not found.`);
        } 

        await Model.findByIdAndDelete(id)
    }

    async findUserByWalletId(walletAdress: string): Promise<Models | null> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        
        const doc = await this.connection.models['User'].findOne({"walletAdress": walletAdress})
        return doc
    }

    async findUserByEmail(email: string): Promise<Models | null> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        
        const doc = await this.connection.models['User'].findOne({"email": email})
        return doc
    }

    async update(cls: string, id: string, ...args: Array<Object>): Promise<void> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');   
        }

        const Model = this.connection.models[cls]

        if (!Model) {
            throw new Error(`Model ${cls} not found.`);
        }

        try {
            await Model.findByIdAndUpdate(id, ...args)
        } catch(err) {
            throw new Error('Failed to update document.')
        }
    }
}