import express, { Request, Response } from "express";
import { createVandor, getDeliveryUsers, getTransactionById, getTransactions, getVandor, getVandorById, verifyDeliveryUser } from "../controllers";

const router = express.Router();

router.post('/vandor', createVandor)
router.get('/vandors', getVandor)
router.get('/vandor/:id', getVandorById)

router.get('/transactions', getTransactions)
router.get('/transaction/:id', getTransactionById)

router.put('/delivery/verify', verifyDeliveryUser)
router.get('/delivery/users', getDeliveryUsers)

export { router as AdminRoutes }