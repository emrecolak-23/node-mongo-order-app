import { Request, Response } from "express"
import { Offer, Vandor } from "../models"
import { FoodDoc } from "../models/food.model"


export const getFoodAvailability = async (req: Request, res: Response) => {    

    const pincode = req.params.pincode

    const result = await Vandor.find({ pincode , serviceAvailable: true })
                               .sort([['rating', 'descending']]) 
                               .populate('foods') 
     
    if(result.length === 0) return res.status(404).json({ message: "No food available" })

    res.status(200).json(result)
}   

export const getTopRestaurants = async (req: Request, res: Response) => {

    const pincode = req.params.pincode

    const result = await Vandor.find({ pincode, serviceAvailable: false })
                               .sort([['rating', 'descending']]) 
                               .limit(10)

    if(result.length === 0) return res.status(404).json({ message: "No food available" })


    res.status(200).json(result)

}


export const getFoodsIn30Mins = async (req: Request, res: Response) => {

    const pincode = req.params.pincode
    const result = await Vandor.find({ pincode, serviceAvailable: false})
                                 .sort([['rating', 'descending']]) 
                                 .populate('foods')

    if(result.length === 0) return res.status(404).json({ message: "No food available" })

    const foodResult: any = []

    result.forEach((vandor: any) => {
        const foods = vandor.foods as [FoodDoc]
        const foodsIn30Min = foods.filter(food => food.readyTime <= 30)
        foodResult.push(...foodsIn30Min)
    })

    res.status(200).json(foodResult)

}


export const searchFoods = async (req: Request, res: Response) => {

    const pincode = req.params.pincode
    const result = await Vandor.find({ pincode, serviceAvailable: false }).populate('foods')

    if(result.length === 0) return res.status(404).json({ message: "No food available" })

    const foodResult: any = []

    result.forEach((item: any) => {
       foodResult.push(...item.foods)
    })


    res.status(200).json(foodResult)

}


export const restaurantsById = async (req: Request, res: Response) => {

    const { id } = req.params

    const result = await Vandor.findById(id).populate('foods')

    if(!result) return res.status(404).json({ message: "No food available" })

    res.status(200).json(result)

}


export const getAvailableOffers = async (req: Request, res: Response) => {
    
    const pincode = req.params.pincode
    const offers = await Offer.find({ pincode, isActive: true })

    if(offers.length === 0) return res.status(404).json({ message: "No offers available" })

    res.status(200).json(offers)

}