import { Router } from "express";
import routeFarm from "./routes/farm.route.js";
import routeFarmer from "./routes/farmer.route.js";
import routeMilkProduction from "./routes/milkProduction.route.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./util/swagger.json" assert { type: "json" };
const route = Router();

route.get("/", (req, res) => {
    res.json({ ping: "pong" });
});

route.use("/api-docs", swaggerUi.serve);
route.get("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

route.use("/farm", routeFarm);
route.use("/farmer", routeFarmer);
route.use("/milk-production", routeMilkProduction);

export default route;