import express from 'express';
import { buyProduct,createProduct } from '../controllers/productController.js';

const router=express.Router();

router.post("/buy", buyProduct);
router.post("/create", createProduct);





export default router;