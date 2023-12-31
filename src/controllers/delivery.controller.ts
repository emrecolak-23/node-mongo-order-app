import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  DeliveryUserDto,
  UserLoginDto,
  EditUserDto
} from "../dto";
import {
  generateSalt,
  generatePassword,
  generateSignature,
  comparePassword,
} from "../utility";

import { DeliveryUser } from "../models";

export const deliverySignUp = async (req: Request, res: Response) => {
  const deliveryUserInput = plainToClass(DeliveryUserDto, req.body);
  const inputErrors = await validate(deliveryUserInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0)
    return res.status(400).json({ message: inputErrors });

  const { email, password, phone, address, firstName, lastName, pincode } = deliveryUserInput;

  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email });

  if (existingDeliveryUser)
    return res.status(400).json({ message: "Delivery User already exists" });

  const result = await DeliveryUser.create({
    email,
    password: userPassword,
    phone,
    salt,
    firstName,
    lastName,
    address,
    pincode,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });

  if (!result)
    return res.status(400).json({ message: "Error creating customer" });

  // generate the signature
  const signature = generateSignature({
    _id: result._id,
    email: result.email,
    verified: result.verified,
  });

  // send the result
  res.status(201).json({
    signature,
    verified: result.verified,
    email: result.email,
  });
};

export const deliveryLogin = async (req: Request, res: Response) => {
  const loginInputs = plainToClass(UserLoginDto, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (loginErrors.length > 0)
    return res.status(400).json({ message: loginErrors });

  const { email, password } = loginInputs;
  const deliveryUser = await DeliveryUser.findOne({ email });
  if (!deliveryUser)
    return res.status(400).json({ message: "Invalid login credentials" });
  const { salt, password: userPassword } = deliveryUser;
  const validationPassword = await comparePassword(
    password,
    userPassword,
    salt
  );
  if (!validationPassword)
    return res.status(400).json({ message: "Invalid login credentials" });
  const signature = generateSignature({
    _id: deliveryUser._id,
    email: deliveryUser.email,
    verified: deliveryUser.verified,
  });

  res.status(200).json({
    signature,
    verified: deliveryUser.verified,
    email: deliveryUser.email,
  });
};



export const getDeliveryUserProfile = async (req: Request, res: Response) => {
  const deliveryUser = req.user;

  if (!deliveryUser) return res.status(400).json({ message: "Invalid user" });

  const deliveryUserProfile = await DeliveryUser.findById(deliveryUser._id);

  if (!deliveryUserProfile) return res.status(400).json({ message: "Invalid user" });

  res.status(200).json(deliveryUserProfile);
};

export const updateDeliveryUserProfile = async (req: Request, res: Response) => {
  const deliveryUser = req.user
  const editDeliveryUserInput = plainToClass(EditUserDto, req.body);
  const editDeliveryUserInputErrors = await validate(editDeliveryUserInput, {
    validationError: { target: true },
  });

  if (editDeliveryUserInputErrors.length > 0)
    return res.status(400).json({ message: editDeliveryUserInputErrors });

  const profile = await DeliveryUser.findById(deliveryUser?._id);
  if (!profile) return res.status(400).json({ message: "Invalid user" });

  const { firstName, lastName, address  } = editDeliveryUserInput;

  profile.firstName = firstName;
  profile.lastName = lastName;
  profile.address = address;

  const updatedDeliveryUser = await profile.save();

  res.status(200).json(updatedDeliveryUser);
};

export const updateDeliveryUserStatus = async (req: Request, res: Response) => {

  const deliveryUser = req.user

  const { lat, lng } = req.body;

  const profile = await DeliveryUser.findById(deliveryUser?._id);
  if (!profile) return res.status(400).json({ message: "Invalid user" });

  if(lat && lng) {
    profile.lat = lat;
    profile.lng = lng;
  }

  profile.isAvailable = !profile.isAvailable;

  const updatedDeliveryUser = await profile.save();

  res.status(200).json(updatedDeliveryUser);

}