import { ObjectId } from "mongodb";
import { close, connect } from "../config/database/index.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../config/errors/index.js";
const createMilkProduction = async (milkProduction) => {
    try {
        const db = await connect();
        const collectionFarms = db.collection('farms');
        const farmDB = await collectionFarms.findOne({ _id: new ObjectId(milkProduction.farmId) });
        if (!farmDB) {
            throw BadRequestError('Invalid farmId');
        }
        const hasMilkProduction = await collectionFarms.findOne({ date: milkProduction.date});
        if (hasMilkProduction) {
            throw ConflictError('MilkProduction already exists, date must be unique');
        }
        const collection = db.collection('milkProductions');
        const collectionMilkProductions = db.collection('milkProductions');
        const milkProductionDB = await collectionMilkProductions.insertOne(milkProduction);
        if (!milkProductionDB.insertedId) {
            throw InternalServerError('MilkProduction not created');
        }
        const createdMilkProduction = await collection.findOne({ _id: milkProductionDB.insertedId });
        return createdMilkProduction;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

const getMilkProduction = async (id) => {
    if (!id) {
        throw BadRequestError('Invalid id');
    }
    try {
        const db = await connect();
        const collectionMilkProductions = db.collection('milkProductions');
        const milkProductionDB = await collectionMilkProductions.findOne({ _id: new ObjectId(id) });
        if (!milkProductionDB) {
            throw NotFoundError('MilkProduction not found');
        }
        const collectionFarms = db.collection('farms');
        milkProductionDB['farm'] = await collectionFarms.findOne({ _id: new ObjectId(milkProductionDB.farmId) });
        return milkProductionDB;
    } catch (err) {
        throw InternalServerError(err)
    } finally {
        close();
    }
}

const getMilkProductionsByFarmId = async (farmId) => {
    try {
        const db = await connect();
        const collectionFarms = db.collection('farms');
        const farmDB = await collectionFarms.findOne({ _id: new ObjectId(farmId) });
        if (!farmDB) {
            throw NotFoundError('Farm not found');
        }
        const collectionMilkProductions = db.collection('milkProductions');
        const milkProductionDB = await collectionMilkProductions.find({ farmId: farmId }).toArray();
        if (!milkProductionDB) {
            throw NotFoundError('MilkProduction not found');
        }
        return milkProductionDB.map(milkProduction => {
            milkProduction['distanceFarmToFactory'] = farmDB.distanceFarmToFactory;
            return milkProduction
        });
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

const updateMilkProduction = async (id, milkProduction) => {
    try {
        const db = await connect();
        const collectionMilkProductions = db.collection('milkProductions');
        const updatedMilkProduction = await collectionMilkProductions.updateOne({ _id: new ObjectId(id) }, { $set: milkProduction });
        if (!updatedMilkProduction.matchedCount) {
            throw NotFoundError('MilkProduction not found');
        }
        return await getMilkProduction(id);
    } catch (err) {
        throw InternalServerError(err);
    }
}

const deleteMilkProduction = async (id) => {
    try {
        const db = await connect();
        const collectionMilkProductions = db.collection('milkProductions');
        const milkProductionDB = await collectionMilkProductions.findOne({ _id: new ObjectId(id) });
        if (!milkProductionDB) {
            throw NotFoundError('MilkProduction not found');
        }

        const deleteMilkProduction = await collectionMilkProductions.deleteOne({
            _id: new ObjectId(id)
        });
        if (!deleteMilkProduction.deletedCount) {
            throw InternalServerError('MilkProduction not deleted');
        }
        return;
    } catch (err) {
        throw InternalServerError(err);
    } finally {
        close();
    }
}

export {
    createMilkProduction,
    getMilkProduction,
    getMilkProductionsByFarmId,
    updateMilkProduction,
    deleteMilkProduction
}