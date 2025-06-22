import express from 'express';
import {
  getAllPayrolls,
  getPayrollById,
  getPayrollsByEmployeeId,
  createPayroll,
  updatePayroll,
  deletePayroll
} from '../controllers/payrollController.js';
// Impor middleware baru dan yang sudah ada
import { authenticate, isAdmin, canViewAllPayrolls, isFinanceOnly } from '../middlewares/authMiddleware.js'; // Tambahkan isFinanceOnly
import { payrollValidationRules, validate } from '../middlewares/validationMiddleware.js';
import { autoGenerateMonthlyPayrolls } from '../controllers/payrollController.js';

const router = express.Router();

// Rute untuk melihat semua gaji (bisa diakses HR atau Finance)
router.get('/', authenticate, canViewAllPayrolls, getAllPayrolls);

// Rute untuk melihat detail gaji (misalnya, HR atau Finance)
router.get('/:id', authenticate, canViewAllPayrolls, getPayrollById);

// Rute untuk melihat gaji per karyawan (bisa karyawan ybs, HR, atau Finance - logika di controller)
router.get('/employee/:employeeId', authenticate, getPayrollsByEmployeeId);

// Rute untuk membuat gaji baru (misalnya, hanya HR)
router.post(
  '/',
  authenticate,
  isAdmin, // Hanya HR yang bisa membuat
  payrollValidationRules.create,
  validate,
  createPayroll
);

// Rute untuk MENGUPDATE gaji (HANYA FINANCE)
router.put(
  '/:id',
  authenticate,
  isFinanceOnly, // Ganti isAdmin menjadi isFinanceOnly
  payrollValidationRules.update,
  validate,
  updatePayroll
);

// Rute untuk menghapus gaji (misalnya, hanya HR)
router.delete(
  '/:id',
  authenticate,
  isAdmin, // Hanya HR yang bisa menghapus
  deletePayroll
);

// Endpoint untuk cron-job trigger gaji otomatis
router.post('/generate-auto', autoGenerateMonthlyPayrolls);

export default router;