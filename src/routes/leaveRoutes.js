import express from 'express';
import { 
  getAllLeaves,
  getLeaveById,
  getLeavesByEmployeeId,
  createLeave,
  updateLeaveStatus,
  deleteLeave
} from '../controllers/leaveController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { leaveValidationRules, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all leaves
router.get('/', authenticate, isAdmin, getAllLeaves);

// Get leave by ID
router.get('/:id', authenticate, getLeaveById);

// Get leaves by employee ID
router.get('/employee/:employeeId', authenticate, getLeavesByEmployeeId);

// Create new leave
router.post(
  '/', 
  authenticate, 
  leaveValidationRules.create, 
  validate, 
  createLeave
);

// Update leave status
router.put(
  '/:id/status', 
  authenticate, 
  isAdmin, 
  leaveValidationRules.updateStatus, 
  validate, 
  updateLeaveStatus
);

// Delete leave
router.delete('/:id', authenticate, deleteLeave);

export default router;
