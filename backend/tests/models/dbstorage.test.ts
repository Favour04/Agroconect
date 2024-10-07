import mongoose, { Document, Connection } from "mongoose";
import { expect } from "chai";
import sinon from "sinon";
import { DbStorage } from "../../models/engine/db_storage"; // Update with the correct path
import { User } from "../../models/user"; // Update with the correct path
import 'ts-node/register';

describe("DbStorage", () => {
    let dbStorage: DbStorage = new DbStorage();
    let uri: string = "";
    let sandbox: sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        dbStorage = new DbStorage();
        uri = "mongodb://localhost:27017/testdb"; // Example test URI
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("connectionFactory", () => {
        it("should establish a MongoDB connection", async () => {
            const createConnectionStub = sandbox.stub(mongoose, "createConnection").resolves({
                model: () => {},
            } as unknown as Connection);

            await dbStorage.connectionFactory(uri);

            expect(createConnectionStub.calledOnce).to.be.true;
        });

        it("should throw an error if connection fails", async () => {
            const createConnectionStub = sandbox.stub(mongoose, "createConnection").rejects(new Error("Connection failed"));

            try {
                await dbStorage.connectionFactory(uri);
            } catch (err) {
                expect(err.message).to.equal("MongoDB connection failed");
            }

            expect(createConnectionStub.calledOnce).to.be.true;
        });
    });

    describe("create", () => {
        it("should create and save a document", async () => {
            // const UserMock = mongoose.model("User", new mongoose.Schema({}));
            // const saveStub = sandbox.stub(UserMock.prototype, "save").resolves({
            //     _id: "testId",
            //     walletAdress: "testAddress",
            // } as unknown as Document);
            
            const userObj = new User(); // Mock user object
            userObj.walletAdress = "12abc34"; // Mock wallet address
            await dbStorage.connectionFactory(uri); // Assume a successful connection

            const result = await dbStorage.create(userObj);
            expect(result).to.have.property("_id");
            expect(result).to.have.property("walletAdress", "12abc34");
        });
    });

    describe("get", () => {
        it("should retrieve a document by id", async () => {
            const ModelMock = mongoose.model("User", new mongoose.Schema({}));
            const findByIdStub = sandbox.stub(ModelMock, "findById").resolves({
                _id: "testId",
                walletAdress: "testAddress",
            } as unknown as Document);

            await dbStorage.connectionFactory(uri);
            const doc = await dbStorage.get("User", "testId");

            expect(findByIdStub.calledOnce).to.be.true;
            expect(doc).to.have.property("_id", "testId");
            expect(doc).to.have.property("walletAdress", "testAddress");
        });
    });

    describe("delete", () => {
        it("should delete a document by id", async () => {
            const ModelMock = mongoose.model("User", new mongoose.Schema({}));
            const findByIdAndDeleteStub = sandbox.stub(ModelMock, "findByIdAndDelete").resolves({
                _id: "testId",
                walletAdress: "testAddress",
            } as unknown as Document);

            await dbStorage.connectionFactory(uri);
            const doc = await dbStorage.delete("User", "testId");

            expect(findByIdAndDeleteStub.calledOnce).to.be.true;
            expect(doc).to.have.property("_id", "testId");
        });
    });

    describe("findUserByWalletId", () => {
        it("should find a user by wallet address", async () => {
            const ModelMock = mongoose.model("User", new mongoose.Schema({}));
            const findOneStub = sandbox.stub(ModelMock, "findOne").resolves({
                _id: "testId",
                walletAdress: "testAddress",
            } as unknown as Document);

            await dbStorage.connectionFactory(uri);
            const user = await dbStorage.findUserByWalletId("testAddress");

            expect(findOneStub.calledOnce).to.be.true;
            expect(user).to.have.property("_id", "testId");
        });
    });

    describe("update", () => {
        it("should update a document by id", async () => {
            const ModelMock = mongoose.model("User", new mongoose.Schema({}));
            const findByIdAndUpdateStub = sandbox.stub(ModelMock, "findByIdAndUpdate").resolves({
                _id: "testId",
                walletAdress: "updatedAddress",
            } as unknown as Document);

            await dbStorage.connectionFactory(uri);
            await dbStorage.update("User", "testId", { walletAdress: "updatedAddress" });

            expect(findByIdAndUpdateStub.calledOnce).to.be.true;
        });
    });
});
