import express from 'express';
import { buyProduct,createProduct } from '../controllers/productController.js';
import isAuthenticated from "../../../../auth/authentication.js";


const router=express.Router();

router.post("/buy",isAuthenticated, buyProduct);
router.post("/create", isAuthenticated,createProduct);


export default router;