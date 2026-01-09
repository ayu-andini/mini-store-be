import { Router } from 'express';
import { getSupplier, updateStock, getStocks } from '../controllers/suppliers';
import { validateStockUpdate } from '../middleware/validate-stock';
import { protect } from '../middleware/auth'; // Assuming auth middleware will be named protect

const router = Router();

router.get('/suppliers', getSupplier);

router.post('/supplier/stocks', validateStockUpdate, updateStock); // batch update stock
router.get('/stocks', protect, getStocks); // Protected route for supplier stocks

export default router;
