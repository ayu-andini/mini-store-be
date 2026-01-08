import { Router } from 'express';
import {  getStock, 
    getSupplier, createSupplier, 
    updateStock } from '../controllers/suppliers';
import { validateStockUpdate } from '../middleware/validate-stock';
// import { validateCreateStock } from '../middleware/validate-create-stock';

const router = Router();

router.get('/suppliers', getSupplier);
router.post('/supplier', createSupplier);

router.post('/supplier/stocks', validateStockUpdate, updateStock);

router.get('/stocks', getStock);

export default router;
