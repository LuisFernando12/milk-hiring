import { Router } from 'express';
import * as  farmController from '../controller/farm.controller.js'
const farmRoute = Router();

farmRoute.get('/', farmController.getAllFarms);
farmRoute.post('/', farmController.createFarm);

farmRoute.get('/:id', farmController.getFarm);
farmRoute.put('/:id', farmController.updateFarm);
farmRoute.delete('/:id', farmController.deleteFarm);

export default farmRoute;