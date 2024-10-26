import { ObjectId } from 'mongodb';
import { isValidID } from '../config/database/index.js';
import * as farmModel from '../model/farm.model.js'
import farmSchema from '../schemas/farm.schema.js';
import validateRequest from '../util/validateRequest.js';
import { BadRequestError } from '../config/errors/index.js';
const createFarm = async (req, res) => {
    try {
        const farm = validateRequest.create(farmSchema, req.body)
        const createdFarm = await farmModel.createFarm(farm);
        return res.status(201).json(createdFarm);
    } catch (err) {
        return res.status(err.status || 500 ).json({ error: err.message });
    }
}

const getFarm = async (req, res) => {
    try {
        const { id } = req.params;      
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        const farmResult = await farmModel.getFarm(id);
        return res.json(farmResult);
    } catch (err) {
        return res.status(err.status || 500 ).json({ error: err.message });
    }
}

const getAllFarms = async (req, res) => {
    try {
        const farmResult = await farmModel.getAllFarms();
        return res.json(farmResult);
    } catch (err) {
        return res.status(err.status || 500 ).json({ error: err.message });
    }
}

const updateFarm = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        const farm = validateRequest.update(farmSchema, req.body);
        const farmResult = await farmModel.updateFarm(farm, id);
        return res.json(farmResult);
    } catch (err) {
        return res.status(err.status || 500 ).json({ error: err.message });
    }
}

const deleteFarm = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        await farmModel.deleteFarm(id);
        return res.status(204).json();
    } catch (err) {
        return res.status(err.status || 500 ).json({error: err.message});
    }
}

export {
    createFarm,
    getFarm,
    getAllFarms,
    updateFarm,
    deleteFarm
}