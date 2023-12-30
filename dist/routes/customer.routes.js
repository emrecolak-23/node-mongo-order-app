"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoutes = router;
/** Signup / Create Customer **/
router.post('/signup', controllers_1.signUp);
/** Login Customer **/
router.post('/login', controllers_1.login);
/** Authentication **/
router.use(middlewares_1.authenticate);
/** Verify Customer Account **/
router.patch('/verify', controllers_1.verify);
/** OTP / Requesting OTP **/
router.get('/otp', controllers_1.requestOTP);
/** Get Customer Profile **/
router.get('/profile', controllers_1.getProfile);
/** Update Customer Profile **/
router.patch('/profile', controllers_1.updateProfile);
//# sourceMappingURL=customer.routes.js.map