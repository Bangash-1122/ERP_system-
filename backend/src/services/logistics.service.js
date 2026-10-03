import { Shipment, Vehicle, Delivery } from '../models/index.js';

export const logisticsService = {
  // Shipments
  async getShipments(query = {}) {
    return Shipment.find(query).sort({ date: -1 });
  },
  async createShipment(data) {
    const count = await Shipment.countDocuments();
    data.shipmentNo = `SHP-${String(count + 1).padStart(5, '0')}`;
    return Shipment.create(data);
  },
  async updateShipment(id, data) {
    return Shipment.findByIdAndUpdate(id, data, { new: true });
  },

  // Vehicles
  async getVehicles() {
    return Vehicle.find().sort({ vehicleNo: 1 });
  },
  async createVehicle(data) {
    return Vehicle.create(data);
  },
  async updateVehicle(id, data) {
    return Vehicle.findByIdAndUpdate(id, data, { new: true });
  },

  // Deliveries
  async getDeliveries() {
    return Delivery.find().sort({ deliveryDate: -1 });
  },
  async createDelivery(data) {
    const count = await Delivery.countDocuments();
    data.deliveryNo = `DEL-${String(count + 1).padStart(5, '0')}`;
    return Delivery.create(data);
  },
  async updateDelivery(id, data) {
    return Delivery.findByIdAndUpdate(id, data, { new: true });
  }
};
