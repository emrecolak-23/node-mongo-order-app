import express from "express"
import { signUp, login, verify, requestOTP, getProfile, updateProfile} from "../controllers"
import { authenticate } from "../middlewares";

const router = express.Router();

/** Signup / Create Customer **/
router.post('/signup', signUp)

/** Login Customer **/
router.post('/login', login)

/** Authentication **/
router.use(authenticate)

/** Verify Customer Account **/
router.patch('/verify', verify)

/** OTP / Requesting OTP **/
router.get('/otp', requestOTP)

/** Get Customer Profile **/
router.get('/profile', getProfile)

/** Update Customer Profile **/
router.patch('/profile', updateProfile)

// Cart

// Order 

// Payment


export { router as CustomerRoutes }