import { Request, Response } from "express"
import { CreateVandorDto } from "../dto"
import { DeliveryUser, Transaction, Vandor } from "../models"
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
        foods: [],
        lat: 0,
        lng: 0
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


export const getTransactions = async (req: Request, res: Response) => {

    const transactions = await Transaction.find({})
    
    if (!transactions.length) return res.status(404).json({ message: "Transactions data not available" })

    res.status(200).json(transactions)
}

export const getTransactionById = async (req: Request, res: Response) => {
    
        const { id } = req.params
    
        const transaction = await Transaction.findById(id)
    
        if (!transaction) return res.status(404).json({ message: "Transaction not found" })
    
        res.status(200).json(transaction)

}

export const verifyDeliveryUser = async (req: Request, res: Response) => {

    const { _id, status } = req.body

    if(!_id) return res.status(400).json({ message: "Invalid user" })

    const profile = await DeliveryUser.findById(_id);
    if (!profile) return res.status(400).json({ message: "Invalid user" });

    profile.verified = status;
    const result = await profile.save();
    res.status(200).json(result);


}

export const getDeliveryUsers = async (req: Request, res: Response) => {

    const deliveryUsers = await DeliveryUser.find({})
    res.status(200).json(deliveryUsers)


}