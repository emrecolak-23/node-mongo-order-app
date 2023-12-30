import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CustomerDto, UserLoginDto, EditUserDto } from "../dto";
import { generateSalt, generatePassword, onRequestOtp, generateOTP, generateSignature, comparePassword } from "../utility";
import { Customer } from "../models/customer.model";

export const signUp = async (req: Request, res: Response) => {

    const customerInputs = plainToClass(CustomerDto, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) return res.status(400).json({ message: inputErrors })

    const { email, password, phone } = customerInputs

    const salt = await generateSalt()
    const userPassword = await generatePassword(password, salt)
    const { otp, expiry: otpExpiry } = generateOTP()

    const existingUser = await Customer.findOne({ email })

    if(existingUser) return res.status(400).json({ message: "User already exists" })
    
    const result = await Customer.create({
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
    })

    if (!result) return res.status(400).json({ message: "Error creating customer" })

    // send the otp to customer
    await onRequestOtp(otp, phone)

    // generate the signature
    const signature = generateSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified   
    })

    // send the result
    res.status(201).json({
        signature,
        verified: result.verified,
        email: result.email,
    })
}

export const login = async (req: Request, res: Response) => {

    const loginInputs = plainToClass(UserLoginDto, req.body)
    const loginErrors = await validate(loginInputs, { validationError: { target: true } })

    if (loginErrors.length > 0) return res.status(400).json({ message: loginErrors })

    const { email, password } = loginInputs
    const customer = await Customer.findOne({ email})
    if(!customer) return res.status(400).json({ message: "Invalid login credentials" })
    const { salt, password: userPassword } = customer
    const validationPassword = await comparePassword(password, userPassword, salt)
    if(!validationPassword) return res.status(400).json({ message: "Invalid login credentials" })   
    const signature = generateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified
    })

    res.status(200).json({
        signature,
        verified: customer.verified,
        email: customer.email,
    })
}

export const verify = async (req: Request, res: Response) => {

    const { otp } = req.body
    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const profile = await Customer.findById(user._id)

    if(!profile) return res.status(400).json({ message: "Invalid user" })

    if(profile.otp !== otp || profile.otpExpiry < new Date()) return res.status(400).json({ message: "Invalid OTP" })

    profile.verified = true
    const updatedCustomer = await profile.save()

    const signature = generateSignature({
        _id: updatedCustomer._id,
        email: updatedCustomer.email,
        verified: updatedCustomer.verified
    })

    res.status(200).json({
        signature,
        verified: updatedCustomer.verified,
        email: updatedCustomer.email,
    })
}


export const requestOTP = async (req: Request, res: Response) => {

    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const profile = await Customer.findById(user._id)

    if(!profile) return res.status(400).json({ message: "Invalid user" })

    const { otp, expiry: otpExpiry } = generateOTP()

    profile.otp = otp
    profile.otpExpiry = otpExpiry

    await profile.save()

    await onRequestOtp(otp, profile.phone)

    res.status(200).json({ message: "OTP sent your registered phone number" })
}

export const getProfile = async (req: Request, res: Response) => {

    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const profile = await Customer.findById(user._id)

    if(!profile) return res.status(400).json({ message: "Invalid user" })

    res.status(200).json(profile)

}

export const updateProfile = async (req: Request, res: Response) => {

    const editCustomerInput = plainToClass(EditUserDto, req.body)
    const editCustomerErrors = await validate(editCustomerInput, { validationError: { target: true } })

    if (editCustomerErrors.length > 0) return res.status(400).json({ message: editCustomerErrors })

    const profile = await Customer.findById(req.user?._id)
    if(!profile) return res.status(400).json({ message: "Invalid user" })

    const { firstName, lastName, address } = editCustomerInput
    
    profile.firstName = firstName
    profile.lastName = lastName
    profile.address = address

    const updatedCustomer = await profile.save()

    res.status(200).json(updatedCustomer)

}