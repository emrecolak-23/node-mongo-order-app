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
exports.updateProfile = exports.getProfile = exports.requestOTP = exports.verify = exports.login = exports.signUp = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../dto");
const utility_1 = require("../utility");
const customer_model_1 = require("../models/customer.model");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerDto, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0)
        return res.status(400).json({ message: inputErrors });
    const { email, password, phone } = customerInputs;
    const salt = yield (0, utility_1.generateSalt)();
    const userPassword = yield (0, utility_1.generatePassword)(password, salt);
    const { otp, expiry: otpExpiry } = (0, utility_1.generateOTP)();
    const existingUser = yield customer_model_1.Customer.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });
    const result = yield customer_model_1.Customer.create({
        email,
        password: userPassword,
        phone,
        salt,
        otp,
        otpExpiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0
    });
    if (!result)
        return res.status(400).json({ message: "Error creating customer" });
    // send the otp to customer
    yield (0, utility_1.onRequestOtp)(otp, phone);
    // generate the signature
    const signature = (0, utility_1.generateSignature)({
        _id: result._id,
        email: result.email,
        verified: result.verified
    });
    // send the result
    res.status(201).json({
        signature,
        verified: result.verified,
        email: result.email,
    });
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginDto, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (loginErrors.length > 0)
        return res.status(400).json({ message: loginErrors });
    const { email, password } = loginInputs;
    const customer = yield customer_model_1.Customer.findOne({ email });
    if (!customer)
        return res.status(400).json({ message: "Invalid login credentials" });
    const { salt, password: userPassword } = customer;
    const validationPassword = yield (0, utility_1.comparePassword)(password, userPassword, salt);
    if (!validationPassword)
        return res.status(400).json({ message: "Invalid login credentials" });
    const signature = (0, utility_1.generateSignature)({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified
    });
    res.status(200).json({
        signature,
        verified: customer.verified,
        email: customer.email,
    });
});
exports.login = login;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const profile = yield customer_model_1.Customer.findById(user._id);
    if (!profile)
        return res.status(400).json({ message: "Invalid user" });
    if (profile.otp !== otp || profile.otpExpiry < new Date())
        return res.status(400).json({ message: "Invalid OTP" });
    profile.verified = true;
    const updatedCustomer = yield profile.save();
    const signature = (0, utility_1.generateSignature)({
        _id: updatedCustomer._id,
        email: updatedCustomer.email,
        verified: updatedCustomer.verified
    });
    res.status(200).json({
        signature,
        verified: updatedCustomer.verified,
        email: updatedCustomer.email,
    });
});
exports.verify = verify;
const requestOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const profile = yield customer_model_1.Customer.findById(user._id);
    if (!profile)
        return res.status(400).json({ message: "Invalid user" });
    const { otp, expiry: otpExpiry } = (0, utility_1.generateOTP)();
    profile.otp = otp;
    profile.otpExpiry = otpExpiry;
    yield profile.save();
    yield (0, utility_1.onRequestOtp)(otp, profile.phone);
    res.status(200).json({ message: "OTP sent your registered phone number" });
});
exports.requestOTP = requestOTP;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(400).json({ message: "Invalid user" });
    const profile = yield customer_model_1.Customer.findById(user._id);
    if (!profile)
        return res.status(400).json({ message: "Invalid user" });
    res.status(200).json(profile);
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const editCustomerInput = (0, class_transformer_1.plainToClass)(dto_1.EditUserDto, req.body);
    const editCustomerErrors = yield (0, class_validator_1.validate)(editCustomerInput, { validationError: { target: true } });
    if (editCustomerErrors.length > 0)
        return res.status(400).json({ message: editCustomerErrors });
    const profile = yield customer_model_1.Customer.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (!profile)
        return res.status(400).json({ message: "Invalid user" });
    const { firstName, lastName, address } = editCustomerInput;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;
    const updatedCustomer = yield profile.save();
    res.status(200).json(updatedCustomer);
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=customer.controller.js.map