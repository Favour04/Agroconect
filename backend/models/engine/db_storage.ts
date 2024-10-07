import mongoose, { Connection, model, Document, createConnection } from 'mongoose';
import { User } from "../user"

type ClassInstances = User

interface DbStorageInterface {
    connectionFactory(uri: string): Promise<void>;
    create(obj: ClassInstances): Promise<Document | void>;
    get(cls: string, id: string): Promise<Document | void>;
    delete(cls:string, id: string): Promise<Document | void>;
    findUserByWalletId(walletAdress: string): Promise<Document | void>
    update(cls: string, id: string, ...args: Array<Object>): Promise<void>
}


export class DbStorage implements DbStorageInterface {
    private connection: Connection | null = null;

    async connectionFactory(uri: string): Promise<void> {
        if (!this.connection) {
            try {
                const conn = await createConnection(uri);
                conn.model("User", User.UserSchema);
                this.connection = conn
            } catch(err) {
                console.error('Failed to connect to MongoDB:', err);
                throw new Error('MongoDB connection failed');
            }
        } 
    }

    async create(obj: ClassInstances): Promise<Document | void> {
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

    async get(cls: string, id: string): Promise<Document | void> {
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

    async delete(cls: string, id: string): Promise<Document | void> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        
        const Model = this.connection.models[cls]
        
        if(!Model) {
            throw new Error(`Model ${cls} not found.`);
        } 

        const doc = await Model.findByIdAndDelete(id)
        return doc
    }

    async findUserByWalletId(walletAdress: string): Promise<Document | void>{
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        
        const doc = await this.connection.models['User'].findOne({"walletAdress": walletAdress})
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