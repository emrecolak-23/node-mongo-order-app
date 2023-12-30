import { Request, Response } from "express";
import { VandorLoginDto, VandorUpdateDto, CreateFoodDto } from "../dto";
import { findVandor } from "./admin.controller";
import { comparePassword, generateSignature } from "../utility";
import { Food } from "../models/food.model";

export const vendorLogin = async (req: Request, res: Response) => {

    const {
        email,
        password
    } = <VandorLoginDto>req.body

    const existingVandor = await findVandor(undefined, email)

    if(!existingVandor) return res.status(400).json({ message: "Login credential not valid" })

    const { salt, password: userPassword } = existingVandor
    const validatePassword = await comparePassword(password, userPassword, salt)

    if(!validatePassword) return res.status(400).json({ message: "Login credential not valid" })

    const signature = generateSignature({ 
        _id: existingVandor._id, 
        email: existingVandor.email,
        name: existingVandor.name,
        foodType: existingVandor.foodType
    })

    res.status(200).json(signature)
    
}


export const getVandorProfile = async (req: Request, res: Response) => {
    const user = req.user
    if(!user) return res.status(400).json({ message: "Invalid user" })

    const existingVandor = await findVandor(user._id)
    res.status(200).json(existingVandor)

}


export const updateVandorProfile = async (req: Request, res: Response) => {
    const { name, foodType, address, phone } = <VandorUpdateDto>req.body
    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const existingVandor = await findVandor(user._id)
    if(!existingVandor) return res.status(400).json({ message: "Vandor not found" })
    
    existingVandor.name = name
    existingVandor.foodType = foodType
    existingVandor.address = address
    existingVandor.phone = phone

    const savedVandor = await existingVandor.save()

    res.status(200).json(savedVandor)

}

export const updateVandorCoverImage = async (req: Request, res: Response) => {

    const user = req.user
    const files = req.files as Express.Multer.File[]
    if(!user) return res.status(400).json({ message: "Invalid user" })

    const vandor = await findVandor(user._id)
    if(!vandor) return res.status(400).json({ message: "Vandor not found" })
    const images = files.map(file => file.filename)
    console.log(images)
    vandor.coverImages.push(...images)
    const savedVandor = await vandor.save()

    res.status(200).json(savedVandor)
    

}

export const updateVandorService = async (req: Request, res: Response) => {

    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const existingVandor = await findVandor(user._id)
    if(!existingVandor) return res.status(400).json({ message: "Vandor not found" })

    existingVandor.serviceAvailable = !existingVandor.serviceAvailable
    const savedVandor = await existingVandor.save()

    res.status(200).json(savedVandor)

}

export const addFood = async (req: Request, res: Response) => {

   
    const user = req.user
    if(!user) return res.status(400).json({ message: "Invalid user" })

    const {
        name,
        description,
        category,
        foodType,
        readyTime,
        price
     } = <CreateFoodDto>req.body

    const existingVandor = await findVandor(user._id)
    if(!existingVandor) return res.status(400).json({ message: "Vandor not found" })

    const files = req.files as Express.Multer.File[] 
     
    const images = files.map(file => file.filename)

    const createdFood = await Food.create({
        vandorId: existingVandor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        rating: 0,
        images: images
    })

    existingVandor.foods.push(createdFood)
    const result = await existingVandor.save()

    res.status(201).json(result)

}


export const getFoods = async (req: Request, res: Response) => {
    const user = req.user

    if(!user) return res.status(400).json({ message: "Invalid user" })

    const foods = await Food.find({ vandorId: user._id })

    if(!foods) {
        return res.status(404).json({ message: "Foods not found" })
    }

    res.status(200).json(foods)

}