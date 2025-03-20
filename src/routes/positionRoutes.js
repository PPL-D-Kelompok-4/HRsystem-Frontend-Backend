import express from 'express';
import { 
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} from '../controllers/positionController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { positionValidationRules, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all positions
router.get('/', authenticate, getAllPositions);

// Get position by ID
router.get('/:id', authenticate, getPositionById);

// Create new position
router.post(
  '/', 
  authenticate, 
  isAdmin, 
  positionValidationRules.create, 
  validate, 
  createPosition
);

// Update position
router.put(
  '/:id', 
  authenticate, 
  isAdmin, 
  positionValidationRules.update, 
  validate, 
  updatePosition
);

// Delete position
router.delete('/:id', authenticate, isAdmin, deletePosition);

export default router;
