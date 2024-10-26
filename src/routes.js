import { Router } from "express";
import routeFarm from "./routes/farm.route.js";
import routeFarmer from "./routes/farmer.route.js";
import routeMilkProduction from "./routes/milkProduction.route.js";
const route = Router();

route.get("/", (req, res) => {
    res.json({ ping: "pong" });
});

route.use("/farm", routeFarm);
route.use("/farmer", routeFarmer);
route.use("/milk-production", routeMilkProduction);

export default route;