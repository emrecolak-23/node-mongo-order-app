import express, { Request, Response } from "express";
import multer from "multer";
import {
  vendorLogin,
  getVandorProfile,
  updateVandorProfile,
  updateVandorService,
  addFood,
  getFoods,
  updateVandorCoverImage,
  getCurrentOrders,
  getOrderDetail,
  processOrder,
  getOffers,
  addOffer,
  editOffer
} from "../controllers/vandor.controller";
import { authenticate } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
const images = multer({
  storage: imageStorage,
  limits: { fileSize: fileSizeLimit },
}).array("images", 10);

router.post("/login", vendorLogin);
router.use(authenticate);
router.get("/profile", getVandorProfile);
router.patch("/profile", updateVandorProfile);
router.patch("/cover-image", images, updateVandorCoverImage);
router.patch("/service", updateVandorService);

router.post("/food", images, addFood);
router.get("/foods", getFoods);

// Orders
router.get("/orders", getCurrentOrders);
router.put("/order/:id/process", processOrder);
router.get("/order/:id", getOrderDetail);


// Offers
router.get('/offers', getOffers)
router.post('/offer', addOffer)
router.put('/offer/:id', editOffer)
// Delete Offers

export { router as VandorRoutes };
