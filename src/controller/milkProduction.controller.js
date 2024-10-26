import { isValidID } from '../config/database/index.js';
import { BadRequestError, NotFoundError } from '../config/errors/index.js';
import * as milkProductionModel from '../model/milkProduction.model.js';
import milkProductionSchema from '../schemas/milkProduction.schema.js';
import dateFormat from '../util/dateFormat.js';
import milkLiterPrice from '../util/milkLiterPrice.js';
import validateRequest from '../util/validateRequest.js';
const monthEnum = Object.freeze({
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',    
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
});


const createMilkProduction = async (req, res) => {
    try {
        const milkProduction = validateRequest.create(milkProductionSchema, req.body);
        const newMilkProduction = {
            farmId: milkProduction.farmId,
            date: dateFormat(milkProduction.date),
            quantity: milkProduction.quantity
        };
        const createdMilkProduction = await milkProductionModel.createMilkProduction(newMilkProduction);
        return res.status(201).json(createdMilkProduction);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const getMilkProduction = async (req, res) => {
    try {
        const { id } = req.params;
        const milkProductionResult = await milkProductionModel.getMilkProduction(id);
        return res.json(milkProductionResult);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const getAllMilkProductionsByFarmAndMonth = async (req, res) => {
    try {
        const { farmId, month } = req.params;
        const milkProductionResult = await milkProductionModel.getMilkProductionsByFarmId(farmId);

        const milkProductionFilterByDay = {};
        milkProductionResult.forEach(milkProduction => {
            if (milkProduction.date.split(',')[0].split('/')[1] === month) {
                const date = milkProduction.date.split(',')[0];
                if (!milkProductionFilterByDay[date]) {
                    milkProductionFilterByDay[date] = {
                        entryTimes: [milkProduction.date],
                        quantity: milkProduction.quantity,
                    };
                    return
                }
                if (!milkProductionFilterByDay[date].entryTimes.includes(milkProduction.date)) {
                    milkProductionFilterByDay[date].entryTimes.push(milkProduction.date);
                }
                milkProductionFilterByDay[date].quantity += milkProduction.quantity;
                return
            }
        });

        const milkProductionByFarm = Object.values(milkProductionFilterByDay);
        const totalMonthly = milkProductionByFarm.reduce((total, milkProduction) => total + milkProduction.quantity, 0);
        const median = (totalMonthly / milkProductionByFarm.length);

        return res.json({
            milkProductionByFarm: milkProductionByFarm,
            totalMonthly,
            median
        });

    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const getPricePaidToFarmerByFarmAndMonth = async (req, res) => {
    try {
        const { farmId, month } = req.params;
        if (!farmId || !month) {
            throw BadRequestError('Invalid farmId or month');
        }
        const milkProductionsDB = await milkProductionModel.getMilkProductionsByFarmId(farmId);

        const milkProductionsByFarm = milkProductionsDB.filter((milkProduction) => milkProduction.date.split(',')[0].split('/')[1] === month);
        const totalQuatityMilkProductions = milkProductionsByFarm.reduce((total, milkProduction) => total + milkProduction.quantity, 0);

        const price = milkLiterPrice(totalQuatityMilkProductions, milkProductionsDB[0].distanceFarmToFactory);

        return res.json(
            {
                totalLitersMilk: totalQuatityMilkProductions,
                monthPrice: {
                    en: Intl.NumberFormat('en', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price),
                    br: Intl.NumberFormat('pt-br', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price),
                },
                pricePerLiter: {
                    en: Intl.NumberFormat('en', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price / totalQuatityMilkProductions),
                    br: Intl.NumberFormat('pt', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price / totalQuatityMilkProductions),
                }
            }
        );
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const getPricePaidToFarmerByFarmAndYear = async (req, res) => {
    try {
        const { farmId, year } = req.params;
        if (!farmId || !year) {
            throw BadRequestError('Invalid farmId or year');
        }
        if (year.length !== 4) {
            throw BadRequestError('Invalid year');
        }
        const milkProductionsDB = await milkProductionModel.getMilkProductionsByFarmId(farmId);
        const milkProductionAgroupByMonth = {};

        milkProductionsDB.forEach((milkProduction) => {
            if (milkProduction.date.split(',')[0].split('/')[2] === year) {
                const month = milkProduction.date.split(',')[0].split('/')[1];
                if (!milkProductionAgroupByMonth[monthEnum[month]]) {
                    milkProductionAgroupByMonth[monthEnum[month]] = {
                        quantity: milkProduction.quantity,
                        distanceFarmToFactory: milkProduction.distanceFarmToFactory,
                        monthNumber: Number(month)
                    }
                    return;
                }
                milkProductionAgroupByMonth[monthEnum[month]].quantity += milkProduction.quantity
            }
        });

        for (const key in milkProductionAgroupByMonth) {
            const { quantity, distanceFarmToFactory, monthNumber } = milkProductionAgroupByMonth[key]
            const price = milkLiterPrice(quantity, distanceFarmToFactory, monthNumber);
            milkProductionAgroupByMonth[key]['monthPrice'] = {
                en: Intl.NumberFormat('en', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price),
                br: Intl.NumberFormat('pt-br', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)
            }
            milkProductionAgroupByMonth[key]['pricePerLiter'] = {
                en: Intl.NumberFormat('en', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((price / quantity)),
                br: Intl.NumberFormat('pt-br', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((price / quantity))
            };

            delete milkProductionAgroupByMonth[key].monthNumber;
            delete milkProductionAgroupByMonth[key].distanceFarmToFactory;

        }

        return res.json(milkProductionAgroupByMonth);


    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const updateMilkProduction = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id')
        }
        const milkProduction = validateRequest.update(milkProductionSchema, req.body);
        const updatedMilkProduction = await milkProductionModel.updateMilkProduction(id, milkProduction);
        return res.json(updatedMilkProduction);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}

const deleteMilkProduction = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidID(id)) {
            throw BadRequestError('Invalid id');
        }
        await milkProductionModel.deleteMilkProduction(id);
        return res.status(204).json();
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
}


export {
    createMilkProduction,
    getMilkProduction,
    getAllMilkProductionsByFarmAndMonth,
    getPricePaidToFarmerByFarmAndMonth,
    getPricePaidToFarmerByFarmAndYear,
    updateMilkProduction,
    deleteMilkProduction
};