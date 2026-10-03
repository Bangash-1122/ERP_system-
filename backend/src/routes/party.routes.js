import express from 'express';
import { partyController } from '../controllers/party.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Customers
router.get('/customers', partyController.getCustomers);
router.post('/customers', partyController.createCustomer);
router.put('/customers/:id', partyController.updateCustomer);
router.delete('/customers/:id', partyController.deleteCustomer);

// Suppliers
router.get('/suppliers', partyController.getSuppliers);
router.post('/suppliers', partyController.createSupplier);
router.put('/suppliers/:id', partyController.updateSupplier);
router.delete('/suppliers/:id', partyController.deleteSupplier);

// Transporters
router.get('/transporters', partyController.getTransporters);
router.post('/transporters', partyController.createTransporter);
router.put('/transporters/:id', partyController.updateTransporter);
router.delete('/transporters/:id', partyController.deleteTransporter);

// Employees
router.get('/employees', partyController.getEmployees);
router.post('/employees', partyController.createEmployee);
router.put('/employees/:id', partyController.updateEmployee);
router.delete('/employees/:id', partyController.deleteEmployee);

// Owners, Partnerships, Saraf
router.get('/owners', partyController.getOwners);
router.get('/partnerships', partyController.getPartnerships);
router.get('/saraf', partyController.getSarafs);
router.post('/saraf', partyController.createSaraf);

export default router;
