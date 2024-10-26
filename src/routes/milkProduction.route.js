import { Router } from "express";
import * as  milkProductionController from "../controller/milkProduction.controller.js"
const routeMilkProduction = Router();

routeMilkProduction.post("/", milkProductionController.createMilkProduction);

routeMilkProduction.get("/farm/:farmId/month/:month", milkProductionController.getAllMilkProductionsByFarmAndMonth);
routeMilkProduction.get("/farm/:farmId/month/:month/price", milkProductionController.getPricePaidToFarmerByFarmAndMonth);
routeMilkProduction.get("/farm/:farmId/year/:year/price", milkProductionController.getPricePaidToFarmerByFarmAndYear);

routeMilkProduction.get("/:id", milkProductionController.getMilkProduction);
routeMilkProduction.put("/:id", milkProductionController.updateMilkProduction);
routeMilkProduction.delete("/:id", milkProductionController.deleteMilkProduction);


export default routeMilkProduction;