import express from 'express';
import { logisticsController } from '../controllers/logistics.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Shipments
router.get('/shipments', logisticsController.getShipments);
router.post('/shipments', logisticsController.createShipment);
router.put('/shipments/:id', logisticsController.updateShipment);

// Vehicles
router.get('/vehicles', logisticsController.getVehicles);
router.post('/vehicles', logisticsController.createVehicle);
router.put('/vehicles/:id', logisticsController.updateVehicle);

// Deliveries
router.get('/deliveries', logisticsController.getDeliveries);
router.post('/deliveries', logisticsController.createDelivery);
router.put('/deliveries/:id', logisticsController.updateDelivery);

export default router;
