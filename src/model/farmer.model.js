import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../config/errors/index.js";
import { connect, close } from "../config/database/index.js";
import { ObjectId } from "mongodb";

const FarmerSchema = Object.freeze({
    name: '',
    birthDate: '',
    documentNumber: '',
    address: {
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
    },
    phone: '',
    email: ''
});

const createFarmer = async (farmer) => {
    try {
        const db = await connect();
        const collection = db.collection('farmers');
        const farmerVerifyCPF = await collection.findOne({ documentNumber: farmer.documentNumber });
        if (farmerVerifyCPF) {
            throw ConflictError('Farmer already exists');
        }
        const farmerVerifyEmail = await collection.findOne({ email: farmer.email });
        if (farmerVerifyEmail) {
            throw ConflictError('Farmer already exists');
        }
        const farmerDB = await collection.insertOne(farmer);
        if (!farmerDB.insertedId) {
            throw InternalServerError('Farmer not created');
        }
        const createdFarmerDB = await collection.findOne({ _id: farmerDB.insertedId });
        if (!createdFarmerDB) {
            throw InternalServerError('Farmer not created');
        }
        return createdFarmerDB;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

const getFarmer = async (id) => {
    try {
        if (!id) {
            throw NotFoundError('Farmer not found');
        }
        const db = await connect();
        const collection = db.collection('farmers');
        const farmerDB = await collection.findOne({ _id: new ObjectId(id) });
        if (!farmerDB) {
            throw NotFoundError('Farmer not found');
        }
        return farmerDB;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

const getAllFarmers = async () => {
    try {
        const db = await connect();
        const collection = db.collection('farmers');
        const farmerDB = await collection.find().toArray();
        return farmerDB;
    } catch (err) {
        throw InternalServerError(err.message);
    } finally {
        close();
    }
}

const updateFarmer = async (farmer, id) => {
        try {
            id = new ObjectId(id);
            const db = await connect();
            const collection = db.collection('farmers');
            const farmerDB = await collection.updateOne({ _id: id }, { $set: farmer });
            if (!farmerDB.matchedCount) {
                throw NotFoundError('Farmer not found');
            }
            const updatedFarmer = await collection.findOne({ _id: id });
            return updatedFarmer;
        }
        catch (err) {
            throw InternalServerError(err);
        } finally {
            close();
        }
}

const deleteFarmer = async (id) => {
    try {
        const objectId = new ObjectId(id);
        const db = await connect();
        const collectionFarmer = db.collection('farmers');
        const farmerDB = await collectionFarmer.findOne({ _id: objectId });
        if (!farmerDB) {
            throw NotFoundError('Farmer not found');
        }
        const collectionFarm = db.collection('farms');
        const farmDB = await collectionFarm.findOne({ farmerId: id });
        if (farmDB) {
            throw ConflictError('Farmer has farms');
        }
        const farmerDelete = await collectionFarmer.deleteOne({ _id: objectId });
        if (!farmerDelete.deletedCount) {
            throw InternalServerError('Farmer not deleted');
        }
        return;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

export {
    createFarmer,
    getFarmer,
    getAllFarmers,
    updateFarmer,
    deleteFarmer
}