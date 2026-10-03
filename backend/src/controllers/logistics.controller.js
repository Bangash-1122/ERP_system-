import { logisticsService } from '../services/logistics.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const logisticsController = {
    // Shipments
    getShipments: asyncHandler(async (req, res) => {
        const data = await logisticsService.getShipments(req.query);
        return ok(res, data);
    }),
    createShipment: asyncHandler(async (req, res) => {
        const data = await logisticsService.createShipment(req.body);
        return ok(res, data, 'Shipment created successfully', 201);
    }),
    updateShipment: asyncHandler(async (req, res) => {
        const data = await logisticsService.updateShipment(req.params.id, req.body);
        return ok(res, data, 'Shipment updated successfully');
    }),

    // Vehicles
    getVehicles: asyncHandler(async (req, res) => {
        const data = await logisticsService.getVehicles();
        return ok(res, data);
    }),
    createVehicle: asyncHandler(async (req, res) => {
        const data = await logisticsService.createVehicle(req.body);
        return ok(res, data, 'Vehicle added successfully', 201);
    }),
    updateVehicle: asyncHandler(async (req, res) => {
        const data = await logisticsService.updateVehicle(req.params.id, req.body);
        return ok(res, data, 'Vehicle updated successfully');
    }),

    // Deliveries
    getDeliveries: asyncHandler(async (req, res) => {
        const data = await logisticsService.getDeliveries();
        return ok(res, data);
    }),
    createDelivery: asyncHandler(async (req, res) => {
        const data = await logisticsService.createDelivery(req.body);
        return ok(res, data, 'Delivery scheduled successfully', 201);
    }),
    updateDelivery: asyncHandler(async (req, res) => {
        const data = await logisticsService.updateDelivery(req.params.id, req.body);
        return ok(res, data, 'Delivery status updated successfully');
    })
};

export default logisticsController;
