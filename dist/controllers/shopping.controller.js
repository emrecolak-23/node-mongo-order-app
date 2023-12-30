"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantsById = exports.searchFoods = exports.getFoodsIn30Mins = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const models_1 = require("../models");
const getFoodAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length === 0)
        return res.status(404).json({ message: "No food available" });
    res.status(200).json(result);
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .limit(10);
    if (result.length === 0)
        return res.status(404).json({ message: "No food available" });
    res.status(200).json(result);
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodsIn30Mins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: false })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length === 0)
        return res.status(404).json({ message: "No food available" });
    const foodResult = [];
    result.forEach((vandor) => {
        const foods = vandor.foods;
        const foodsIn30Min = foods.filter(food => food.readyTime <= 30);
        foodResult.push(...foodsIn30Min);
    });
    res.status(200).json(foodResult);
});
exports.getFoodsIn30Mins = getFoodsIn30Mins;
const searchFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: false }).populate('foods');
    if (result.length === 0)
        return res.status(404).json({ message: "No food available" });
    const foodResult = [];
    result.forEach((item) => {
        foodResult.push(...item.foods);
    });
    res.status(200).json(foodResult);
});
exports.searchFoods = searchFoods;
const restaurantsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_1.Vandor.findById(id).populate('foods');
    if (!result)
        return res.status(404).json({ message: "No food available" });
    res.status(200).json(result);
});
exports.restaurantsById = restaurantsById;
//# sourceMappingURL=shopping.controller.js.map