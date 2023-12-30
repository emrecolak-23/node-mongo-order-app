import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { VandorPayload, AuthPayload } from '../dto';

export const generateSalt = async () => {
    return await bcrypt.genSalt();
}

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (enteredPasswor: string, storedPassword: string, salt: string) => {
    return await generatePassword(enteredPasswor, salt) === storedPassword
}

export const generateSignature = (payload: AuthPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || "secret", { expiresIn: "1d" })
}

export const validateSignature = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET_KEY || "secret") as AuthPayload
}