import { Request, Response } from "express"
import { CreateVandorDto } from "../dto"
import { Vandor } from "../models"
import { generateSalt, generatePassword } from "../utility"

export const findVandor = async (id: string | undefined, email?:string) => {
    if(email) return await Vandor.findOne({ email })
    else return await Vandor.findById(id) 
}

export const createVandor = async (req: Request, res: Response) => {

    const {
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password
    } = <CreateVandorDto>req.body

    const existingVandor = await findVandor(undefined, email)

    if(existingVandor) return res.status(400).json({ message: "Vandor already exists" })

    const salt = await generateSalt()
    const userPassword = await generatePassword(password, salt)
   
    const createdVandor = await Vandor.create({
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
    })

    res.status(201).json(createdVandor)

}

export const getVandor =  async (req: Request, res: Response) => {

    const vendors = await Vandor.find({})

    if (!vendors) return res.status(404).json({ message: "Vandors data not available" })

    res.status(200).json(vendors)

}


export const getVandorById = async (req: Request, res: Response) => {

    const { id } = req.params

    const vendor = await findVandor(id)

    if (!vendor) return res.status(404).json({ message: "Vandor not found" })

    res.status(200).json(vendor)

}