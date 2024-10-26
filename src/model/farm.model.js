import { ObjectId } from "mongodb";
import { close, connect } from "../config/database/index.js";
import { InternalServerError, NotFoundError, UnauthorizedError, BadRequestError, ConflictError } from "../config/errors/index.js";


const FarmSchema = Object.freeze({
    name: '',
    address: {
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
    },
    distanceFarmToFactory: 0,
    farmerId: ''
})

const createFarm = async (farm) => {    
    try {
        const db = await connect();
        const collectionFarmers = db.collection('farmers');
        const farmerDB = await collectionFarmers.findOne({ _id: new ObjectId(farm.farmerId) });
        if (!farmerDB) {
            throw BadRequestError('Invalid farmerId');
        }
        const collectionFarms = db.collection('farms');
        const hasFarm = await collectionFarms.findOne({ 'address.cep': farm.address.cep });
        if (hasFarm) {
            throw ConflictError('Farm already exists');
        }
        const farmDb = await collectionFarms.insertOne(farm);
        if (!farmDb.insertedId) {
            throw InternalServerError('Farm not created');
        }
        const createdFarm = await collectionFarms.findOne({ _id: farmDb.insertedId });
        return createdFarm;
    } catch (err) {
        throw InternalServerError(err)
    } finally {
        close();
    }
}

const getFarm = async (id) => {
    try {
        const db = await connect();
        const collection = db.collection('farms');
        const farmDB = await collection.findOne({ _id: new ObjectId(id) });
        if (!farmDB) {
            throw NotFoundError('Farm not found')
        }
        const collectionFarmer = db.collection('farmers');
        farmDB['farmer'] = await collectionFarmer.findOne({ _id: new ObjectId(farmDB.farmerId) });
        delete farmDB['farmerId'];
        return farmDB;
    } catch (err) {
        throw InternalServerError(err)
    } finally {
        close();
    }
}

const getAllFarms = async () => {
    try {
        const db = await connect();
        const collection = db.collection('farms');
        const farmDB = await collection.find().toArray();
        return farmDB;
    } catch (err) {
        throw InternalServerError(err)
    } finally {
        close();
    }
}

const updateFarm = async (farm, id) => {
    if (farm.farmerId) {
        throw BadRequestError("Invalid farm data, cannot change the owner's id");
    }
    try {
        const db = await connect();
        const collection = db.collection('farms');
        const farmDB = await collection.updateOne({ _id: new ObjectId(id) }, { $set: farm })
        if (!farmDB.matchedCount) {
            throw InternalServerError('Farm not updated');
        }
        const updatedFarm = await getFarm(id);
        if (!updatedFarm) {
            throw NotFoundError('Farm not found');
        }
        return updatedFarm;
    } catch (err) {
        throw InternalServerError(err);
    }
}

const deleteFarm = async (id) => {
    try {
        const objectId = new ObjectId(id);
        const db = await connect();
        const collection = db.collection('farms');
        const farmDB = await collection.findOne({ _id: objectId });
        if (!farmDB) {
            throw NotFoundError('Farm not found')
        }
        const deleteFarmeDB = await collection.deleteOne({ _id: farmDB._id });
        if (!deleteFarmeDB.deletedCount) {
            throw InternalServerError("Farm not deleted");
        }
        return;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

export {
    createFarm,
    getFarm,
    getAllFarms,
    updateFarm,
    deleteFarm
}
