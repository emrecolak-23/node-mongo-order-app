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
exports.getVandorById = exports.getVandor = exports.createVandor = exports.findVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const findVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email)
        return yield models_1.Vandor.findOne({ email });
    else
        return yield models_1.Vandor.findById(id);
});
exports.findVandor = findVandor;
const createVandor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
    const existingVandor = yield (0, exports.findVandor)(undefined, email);
    if (existingVandor)
        return res.status(400).json({ message: "Vandor already exists" });
    const salt = yield (0, utility_1.generateSalt)();
    const userPassword = yield (0, utility_1.generatePassword)(password, salt);
    const createdVandor = yield models_1.Vandor.create({
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password: userPassword,
        salt,
        serviceAvailable: false,
        rating: 0,
        coverImages: [],
        foods: []
    });
    res.status(201).json(createdVandor);
});
exports.createVandor = createVandor;
const getVandor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vandor.find({});
    if (!vendors)
        return res.status(404).json({ message: "Vandors data not available" });
    res.status(200).json(vendors);
});
exports.getVandor = getVandor;
const getVandorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vendor = yield (0, exports.findVandor)(id);
    if (!vendor)
        return res.status(404).json({ message: "Vandor not found" });
    res.status(200).json(vendor);
});
exports.getVandorById = getVandorById;
//# sourceMappingURL=admin.controller.js.map