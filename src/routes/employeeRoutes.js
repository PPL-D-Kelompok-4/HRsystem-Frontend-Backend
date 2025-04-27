import express from 'express';
import { 
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus, // <-- Tambahan
  deleteEmployee
} from '../controllers/employeeController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import { employeeValidationRules, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all employees
router.get('/', /*authenticate,*/ getAllEmployees);

// Get employee by ID
router.get('/:id', /*authenticate,*/ getEmployeeById);

// Create new employee
router.post(
  '/', 
  /*authenticate,*/ 
  isAdmin, 
  employeeValidationRules.create, 
  validate, 
  createEmployee
);

// Update employee status only
router.put('/:id/status', /*authenticate,*/ isAdmin, updateEmployeeStatus);

// Update employee
router.put(
  '/:id', 
  /*authenticate,*/ 
  isAdmin, 
  employeeValidationRules.update, 
  validate, 
  updateEmployee
);

// Delete employee
router.delete('/:id', /*authenticate,*/ isAdmin, deleteEmployee);

export default router;
