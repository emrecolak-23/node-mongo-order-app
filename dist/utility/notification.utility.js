"use strict";
// Email
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
exports.onRequestOtp = exports.generateOTP = void 0;
// Notifications
// OTP
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    console.log(expiry, "expiry");
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    console.log(expiry, "expiry set time");
    return { otp, expiry };
};
exports.generateOTP = generateOTP;
const onRequestOtp = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    const client = require('twilio')(accountSid, authToken);
    const result = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from,
        to: `+90${to}`
    });
    return result;
});
exports.onRequestOtp = onRequestOtp;
// Payment Notification or Emails
//# sourceMappingURL=notification.utility.js.map