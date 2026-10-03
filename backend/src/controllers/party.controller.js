import { partyService } from '../services/party.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const partyController = {
    // Customers
    getCustomers: asyncHandler(async (req, res) => {
        const data = await partyService.getCustomers();
        return ok(res, data);
    }),
    createCustomer: asyncHandler(async (req, res) => {
        const data = await partyService.createCustomer(req.body);
        return ok(res, data, 'Customer added successfully', 201);
    }),
    updateCustomer: asyncHandler(async (req, res) => {
        const data = await partyService.updateCustomer(req.params.id, req.body);
        return ok(res, data, 'Customer updated successfully');
    }),
    deleteCustomer: asyncHandler(async (req, res) => {
        await partyService.deleteCustomer(req.params.id);
        return ok(res, null, 'Customer deleted successfully');
    }),

    // Suppliers
    getSuppliers: asyncHandler(async (req, res) => {
        const data = await partyService.getSuppliers();
        return ok(res, data);
    }),
    createSupplier: asyncHandler(async (req, res) => {
        const data = await partyService.createSupplier(req.body);
        return ok(res, data, 'Supplier added successfully', 201);
    }),
    updateSupplier: asyncHandler(async (req, res) => {
        const data = await partyService.updateSupplier(req.params.id, req.body);
        return ok(res, data, 'Supplier updated successfully');
    }),
    deleteSupplier: asyncHandler(async (req, res) => {
        await partyService.deleteSupplier(req.params.id);
        return ok(res, null, 'Supplier deleted successfully');
    }),

    // Transporters
    getTransporters: asyncHandler(async (req, res) => {
        const data = await partyService.getTransporters();
        return ok(res, data);
    }),
    createTransporter: asyncHandler(async (req, res) => {
        const data = await partyService.createTransporter(req.body);
        return ok(res, data, 'Transporter added successfully', 201);
    }),
    updateTransporter: asyncHandler(async (req, res) => {
        const data = await partyService.updateTransporter(req.params.id, req.body);
        return ok(res, data, 'Transporter updated successfully');
    }),
    deleteTransporter: asyncHandler(async (req, res) => {
        await partyService.deleteTransporter(req.params.id);
        return ok(res, null, 'Transporter deleted successfully');
    }),

    // Employees
    getEmployees: asyncHandler(async (req, res) => {
        const data = await partyService.getEmployees();
        return ok(res, data);
    }),
    createEmployee: asyncHandler(async (req, res) => {
        const data = await partyService.createEmployee(req.body);
        return ok(res, data, 'Employee created successfully', 201);
    }),
    updateEmployee: asyncHandler(async (req, res) => {
        const data = await partyService.updateEmployee(req.params.id, req.body);
        return ok(res, data, 'Employee updated successfully');
    }),
    deleteEmployee: asyncHandler(async (req, res) => {
        await partyService.deleteEmployee(req.params.id);
        return ok(res, null, 'Employee deleted successfully');
    }),

    // Owners, Partnerships, Saraf
    getOwners: asyncHandler(async (req, res) => {
        const data = await partyService.getOwners();
        return ok(res, data);
    }),
    getPartnerships: asyncHandler(async (req, res) => {
        const data = await partyService.getPartnerships();
        return ok(res, data);
    }),
    getSarafs: asyncHandler(async (req, res) => {
        const data = await partyService.getSarafs();
        return ok(res, data);
    }),
    createSaraf: asyncHandler(async (req, res) => {
        const data = await partyService.createSaraf(req.body);
        return ok(res, data, 'Saraf party registered successfully', 201);
    })
};

export default partyController;
