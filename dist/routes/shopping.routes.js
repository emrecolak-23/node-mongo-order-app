"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoutes = router;
/** Food Availabilty **/
router.get('/:pincode', controllers_1.getFoodAvailability);
/** Top Restaurants **/
router.get('/top-restaurants/:pincode', controllers_1.getTopRestaurants);
/** Foods Available in 30 Minutes **/
router.get('/foods-in-30-min/:pincode', controllers_1.getFoodsIn30Mins);
/** Search Foods **/
router.get('/search/:pincode', controllers_1.searchFoods);
/** Find Restaurants ById **/
router.get('/restaurant/:id', controllers_1.restaurantsById);
//# sourceMappingURL=shopping.routes.js.map