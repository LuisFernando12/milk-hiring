import express from "express";
import route from "./src/routes.js";

const app = express();
app.use(express.json());
app.use(route);
app.listen(process.env.PORT, ()=> {
  console.log(`Server running on port ${process.env.PORT}`)
})