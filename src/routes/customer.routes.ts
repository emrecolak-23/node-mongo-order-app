import express from "express";
import {
  signUp,
  login,
  verify,
  requestOTP,
  getProfile,
  updateProfile,
  createOrder,
  getOrders,
  getOrderById,
  addToCart,
  getCart,
  deleteCart,
  verifyOffer,
  createPayment
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

/** Signup / Create Customer **/
router.post("/signup", signUp);

/** Login Customer **/
router.post("/login", login);

/** Authentication **/
router.use(authenticate);

/** Verify Customer Account **/
router.patch("/verify", verify);

/** OTP / Requesting OTP **/
router.get("/otp", requestOTP);

/** Get Customer Profile **/
router.get("/profile", getProfile);

/** Update Customer Profile **/
router.patch("/profile", updateProfile);

// Cart
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart", deleteCart);

// Apply Offers
router.get('/offer/verify/:id', verifyOffer)

// Order
router.post("/create-order", createOrder);
router.get("/orders", getOrders);
router.get("/order/:id", getOrderById);

// Payment
router.post('/create-payment', createPayment)


export { router as CustomerRoutes };
