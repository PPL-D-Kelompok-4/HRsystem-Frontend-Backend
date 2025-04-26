import express from 'express';
import { 
  getAllPayrolls,
  getPayrollById,
  getPayrollsByEmployeeId,
  createPayroll,
  updatePayroll,
  deletePayroll
} from '../controllers/payrollController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { payrollValidationRules, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all payrolls
router.get('/', authenticate, isAdmin, getAllPayrolls);

// Get payroll by ID
router.get('/:id', authenticate, getPayrollById);

// Get payrolls by employee ID
router.get('/employee/:employeeId', authenticate, getPayrollsByEmployeeId);

// Create new payroll
router.post(
  '/', 
  authenticate, 
  isAdmin, 
  payrollValidationRules.create, 
  validate, 
  createPayroll
);

// Update payroll
router.put(
  '/:id', 
  authenticate, 
  isAdmin, 
  payrollValidationRules.update, 
  validate, 
  updatePayroll
);

// Delete payroll
router.delete('/:id', authenticate, isAdmin, deletePayroll);

export default router;
