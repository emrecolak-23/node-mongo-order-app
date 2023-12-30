import express from "express"
import { getFoodAvailability, getFoodsIn30Mins, getTopRestaurants, restaurantsById, searchFoods } from "../controllers";


const router = express.Router();

/** Food Availabilty **/
router.get('/:pincode', getFoodAvailability)

/** Top Restaurants **/
router.get('/top-restaurants/:pincode', getTopRestaurants)

/** Foods Available in 30 Minutes **/
router.get('/foods-in-30-min/:pincode', getFoodsIn30Mins)

/** Search Foods **/
router.get('/search/:pincode', searchFoods)

/** Find Restaurants ById **/
router.get('/restaurant/:id', restaurantsById)

export { router as ShoppingRoutes }