import { Router } from "express";
import * as farmerController from "../controller/farmer.controller.js";

const farmerRoute = Router();

farmerRoute.get("/",farmerController.getAllFarmers);
farmerRoute.post("/", farmerController.createFarmer);

farmerRoute.get("/:id",farmerController.getFarmer);
farmerRoute.put("/:id", farmerController.updateFarmer);
farmerRoute.delete("/:id", farmerController.deleteFarmer);

export default farmerRoute;