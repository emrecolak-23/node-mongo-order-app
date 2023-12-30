"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const vandor_controller_1 = require("../controllers/vandor.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.VandorRoutes = router;
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
const images = (0, multer_1.default)({ storage: imageStorage, limits: { fileSize: fileSizeLimit } }).array('images', 10);
router.post('/login', vandor_controller_1.vendorLogin);
router.get('/profile', middlewares_1.authenticate, vandor_controller_1.getVandorProfile);
router.patch('/profile', middlewares_1.authenticate, vandor_controller_1.updateVandorProfile);
router.patch('/cover-image', middlewares_1.authenticate, images, vandor_controller_1.updateVandorCoverImage);
router.patch('/service', middlewares_1.authenticate, vandor_controller_1.updateVandorService);
router.post('/food', middlewares_1.authenticate, images, vandor_controller_1.addFood);
router.get('/foods', middlewares_1.authenticate, vandor_controller_1.getFoods);
//# sourceMappingURL=vandor.routes.js.map