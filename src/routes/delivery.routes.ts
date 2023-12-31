import express from "express";
import {
  deliverySignUp,
  deliveryLogin,
  getDeliveryUserProfile,
  updateDeliveryUserProfile,
  updateDeliveryUserStatus
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

/** Signup / Create Customer **/
router.post("/signup", deliverySignUp);

/** Login Customer **/
router.post("/login", deliveryLogin);

/** Authentication **/
router.use(authenticate);

/** Change Servie Status **/
router.put('/change-status', updateDeliveryUserStatus)

/** Get Customer Profile **/
router.get("/profile", getDeliveryUserProfile);

/** Update Customer Profile **/
router.patch("/profile", updateDeliveryUserProfile);

export { router as DeliveryRoutes };
