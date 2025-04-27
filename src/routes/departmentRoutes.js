import express from 'express';
import { 
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { departmentValidationRules, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all departments
router.get('/', /*authenticate,*/  getAllDepartments);

// Get department by ID
router.get('/:id', /*authenticate,*/  getDepartmentById);

// Create new department
router.post(
  '/', 
  /*authenticate,*/  
  isAdmin, 
  departmentValidationRules.create, 
  validate, 
  createDepartment
);

// Update department
router.put(
  '/:id', 
  /*authenticate,*/ 
  isAdmin, 
  departmentValidationRules.update, 
  validate, 
  updateDepartment
);

// Delete department
router.delete('/:id', /*authenticate,*/  isAdmin, deleteDepartment);

export default router;
