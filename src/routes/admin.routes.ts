import express, { Request, Response } from "express";
import { createVandor, getVandor, getVandorById } from "../controllers";

const router = express.Router();

router.post('/vandor', createVandor)
router.get('/vandors', getVandor)
router.get('/vandor/:id', getVandorById)

export { router as AdminRoutes }