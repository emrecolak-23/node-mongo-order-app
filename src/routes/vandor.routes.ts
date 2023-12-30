import express, { Request, Response } from "express";
import multer from "multer"
import { vendorLogin, getVandorProfile, updateVandorProfile, updateVandorService, addFood, getFoods, updateVandorCoverImage } from "../controllers/vandor.controller";
import { authenticate } from "../middlewares";


const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
const images = multer({ storage: imageStorage, limits: { fileSize: fileSizeLimit } }).array('images', 10)

router.post('/login', vendorLogin)
router.get('/profile', authenticate, getVandorProfile)
router.patch('/profile', authenticate, updateVandorProfile)
router.patch('/cover-image', authenticate, images, updateVandorCoverImage)
router.patch('/service', authenticate, updateVandorService)

router.post('/food', authenticate, images, addFood)
router.get('/foods', authenticate, getFoods)

export { router as VandorRoutes }