import express from "express";
import { 
    getAllOrders, getOrderById,
    createOrder, 
    // updateOrder,
    // deleteOrder,
    getOrdersSummary, 
    // getOrdersSummaryDetail
} from "../controllers/orders";

const router = express.Router()

router.get('/orders/summary', getOrdersSummary)
// router.get('/orders/summary/:id', getOrdersSummaryDetail)
router.get('/orders', getAllOrders)
router.get('/order/:id', getOrderById)
router.post('/order', createOrder)
// router.put('/order/:id', updateOrder)
// router.delete('/order/:id', deleteOrder)

export default router;
