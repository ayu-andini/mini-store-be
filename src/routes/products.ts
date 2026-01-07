import express from "express";
import { 
    getAllProducts, getProducts, 
    createProduct,updateProduct,
    deleteProduct } from "../controllers/products";

const router = express.Router()

router.get('/all-products', getAllProducts)
router.get('/products', getProducts)
// router.get('/product/:id', getProductById)
router.post('/product', createProduct)
router.put('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router;