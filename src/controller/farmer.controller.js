
import { BadRequestError } from "../config/errors/index.js";
import * as farmerModel from "../model/farmer.model.js";
import farmerSchema from "../schemas/farmer.schema.js";
import validateRequest from "../util/validateRequest.js";
import { isValidID } from "../config/database/index.js";

const createFarmer = async (req, res) => {
    try {
        const farmer = validateRequest.create(farmerSchema, req.body);
        const result = await farmerModel.createFarmer(farmer);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    };
}

const getFarmer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        const result = await farmerModel.getFarmer(id);
        return res.status(200).json(result);

    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });

    };
}

const getAllFarmers = async (req, res) => {
    try {
        const result = await farmerModel.getAllFarmers();
        return res.status(200).json(result);

    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });

    }
}

const updateFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        const farmer = validateRequest.update(farmerSchema, req.body);
        const result = await farmerModel.updateFarmer(farmer, id);
        return res.status(200).json(result);

    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });

    };
}
const deleteFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        await farmerModel.deleteFarmer(id);
        return res.status(204).json();

    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });

    };
}

export {
    createFarmer,
    getFarmer,
    getAllFarmers,
    updateFarmer,
    deleteFarmer
}