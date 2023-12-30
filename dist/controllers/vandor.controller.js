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
exports.getFoods = exports.addFood = exports.updateVandorService = exports.updateVandorCoverImage = exports.updateVandorProfile = exports.getVandorProfile = exports.vendorLogin = void 0;
const admin_controller_1 = require("./admin.controller");
const utility_1 = require("../utility");
const food_model_1 = require("../models/food.model");
const vendorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, admin_controller_1.findVandor)(undefined, email);
    if (!existingVandor)
        return res.status(400).json({ message: "Login credential not valid" });
    const { salt, password: userPassword } = existingVandor;
    const validatePassword = yield (0, utility_1.comparePassword)(password, userPassword, salt);
    if (!validatePassword)
        return res.status(400).json({ message: "Login credential not valid" });
    const signature = (0, utility_1.generateSignature)({
        _id: existingVandor._id,
        email: existingVandor.email,
        name: existingVandor.name,
        foodType: existingVandor.foodType
    });
    res.status(200).json(signature);
});
exports.vendorLogin = vendorLogin;
const getVandorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
    res.status(200).json(existingVandor);
});
exports.getVandorProfile = getVandorProfile;
const updateVandorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodType, address, phone } = req.body;
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
    if (!existingVandor)
        return res.status(400).json({ message: "Vandor not found" });
    existingVandor.name = name;
    existingVandor.foodType = foodType;
    existingVandor.address = address;
    existingVandor.phone = phone;
    const savedVandor = yield existingVandor.save();
    res.status(200).json(savedVandor);
});
exports.updateVandorProfile = updateVandorProfile;
const updateVandorCoverImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const files = req.files;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const vandor = yield (0, admin_controller_1.findVandor)(user._id);
    if (!vandor)
        return res.status(400).json({ message: "Vandor not found" });
    const images = files.map(file => file.filename);
    console.log(images);
    vandor.coverImages.push(...images);
    const savedVandor = yield vandor.save();
    res.status(200).json(savedVandor);
});
exports.updateVandorCoverImage = updateVandorCoverImage;
const updateVandorService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
    if (!existingVandor)
        return res.status(400).json({ message: "Vandor not found" });
    existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
    const savedVandor = yield existingVandor.save();
    res.status(200).json(savedVandor);
});
exports.updateVandorService = updateVandorService;
const addFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const { name, description, category, foodType, readyTime, price } = req.body;
    const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
    if (!existingVandor)
        return res.status(400).json({ message: "Vandor not found" });
    const files = req.files;
    const images = files.map(file => file.filename);
    const createdFood = yield food_model_1.Food.create({
        vandorId: existingVandor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        rating: 0,
        images: images
    });
    existingVandor.foods.push(createdFood);
    const result = yield existingVandor.save();
    res.status(201).json(result);
});
exports.addFood = addFood;
const getFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const foods = yield food_model_1.Food.find({ vandorId: user._id });
    if (!foods) {
        return res.status(404).json({ message: "Foods not found" });
    }
    res.status(200).json(foods);
});
exports.getFoods = getFoods;
//# sourceMappingURL=vandor.controller.js.map