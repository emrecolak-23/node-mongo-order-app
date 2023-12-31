import { Request, Response } from "express";
import { VandorLoginDto, VandorUpdateDto, CreateFoodDto, CreateOfferDto } from "../dto";
import { findVandor } from "./admin.controller";
import { comparePassword, generateSignature } from "../utility";
import { Food, Order, Offer, VandorDoc, Vandor } from "../models/";

export const vendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VandorLoginDto>req.body;

  const existingVandor = await findVandor(undefined, email);

  if (!existingVandor)
    return res.status(400).json({ message: "Login credential not valid" });

  const { salt, password: userPassword } = existingVandor;
  const validatePassword = await comparePassword(password, userPassword, salt);

  if (!validatePassword)
    return res.status(400).json({ message: "Login credential not valid" });

  const signature = generateSignature({
    _id: existingVandor._id,
    email: existingVandor.email,
    name: existingVandor.name,
    foodType: existingVandor.foodType,
  });

  res.status(200).json(signature);
};

export const getVandorProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const existingVandor = await findVandor(user._id);
  res.status(200).json(existingVandor);
};

export const updateVandorProfile = async (req: Request, res: Response) => {
  const { name, foodType, address, phone } = <VandorUpdateDto>req.body;
  const user = req.user;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const existingVandor = await findVandor(user._id);
  if (!existingVandor)
    return res.status(400).json({ message: "Vandor not found" });

  existingVandor.name = name;
  existingVandor.foodType = foodType;
  existingVandor.address = address;
  existingVandor.phone = phone;

  const savedVandor = await existingVandor.save();

  res.status(200).json(savedVandor);
};

export const updateVandorCoverImage = async (req: Request, res: Response) => {
  const user = req.user;
  const files = req.files as Express.Multer.File[];
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const vandor = await findVandor(user._id);
  if (!vandor) return res.status(400).json({ message: "Vandor not found" });
  const images = files.map((file) => file.filename);
  console.log(images);
  vandor.coverImages.push(...images);
  const savedVandor = await vandor.save();

  res.status(200).json(savedVandor);
};

export const updateVandorService = async (req: Request, res: Response) => {
  const user = req.user;
  const { lat, lng } = req.body;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const existingVandor = await findVandor(user._id);
  if (!existingVandor)
    return res.status(400).json({ message: "Vandor not found" });

  existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
  if(lat && lng) {
    existingVandor.lat = lat;
    existingVandor.lng = lng;
  }
  const savedVandor = await existingVandor.save();

  res.status(200).json(savedVandor);
};

export const addFood = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodDto
  >req.body;

  const existingVandor = await findVandor(user._id);
  if (!existingVandor)
    return res.status(400).json({ message: "Vandor not found" });

  const files = req.files as Express.Multer.File[];

  const images = files.map((file) => file.filename);

  const createdFood = await Food.create({
    vandorId: existingVandor._id,
    name,
    description,
    category,
    foodType,
    readyTime,
    price,
    rating: 0,
    images: images,
  });

  existingVandor.foods.push(createdFood);
  const result = await existingVandor.save();

  res.status(201).json(result);
};

export const getFoods = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const foods = await Food.find({ vandorId: user._id });

  if (!foods) {
    return res.status(404).json({ message: "Foods not found" });
  }

  res.status(200).json(foods);
};

export const getCurrentOrders = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const orders = await Order.find({ vandorId: user._id }).populate(
    "items.food"
  );
  if (!orders) return res.status(404).json({ message: "Orders not found" });

  res.status(200).json(orders);
};

export const getOrderDetail = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const order = await Order.findById(id).populate("items.food");
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.status(200).json(order);
};

export const processOrder = async (req: Request, res: Response) => {

    const { id:orderId } = req.params;
    const { status, remarks, time } = req.body // ACCEPT, REJECT, UNDER-PROCESS, READY, DELIVERED
    if (!orderId) return res.status(400).json({ message: "Invalid order" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.orderStatus = status
    order.remarks = remarks

    if(time) {
        order.readyTime = time
    }

    const savedOrder = await order.save()

    if(!savedOrder) return res.status(400).json({ message: "Order not saved" });

    res.status(200).json(savedOrder);
    
};


export const getOffers = async (req: Request, res: Response) => {

    const user = req.user
    if(!user) return res.status(400).json({ message: "Unable to get offers" });
    const offers = await Offer.find().populate('vandors')
    
    let currentOffers = Array()
    offers.forEach(offer => {
        
        if(offer.vandors) {
            const vandors = offer.vandors as [VandorDoc]
            vandors.forEach(vandor => {
                if(vandor._id == user._id) {
                    currentOffers.push(offer)
                }
            })
        }
       
        if(offer.offerType === 'GENERIC') {
            currentOffers.push(offer)
        }
    })

    res.status(200).json(currentOffers)

}

export const addOffer = async (req: Request, res: Response) => {

    const user = req.user
    if(!user) return res.status(400).json({ message: "Invalid user" });

    const { title, description, offerType, offerAmount, pincode, promocode, 
            promoType, startValididty, endValididty, bank, bins, minValue, isActive } = <CreateOfferDto>req.body

    const existingVandor = await findVandor(user._id);
    if (!existingVandor)
        return res.status(400).json({ message: "Vandor not found" });

    const offer = await Offer.create({
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promocode,
        promoType,
        startValididty,
        endValididty,
        bank,
        bins,
        minValue,
        isActive,
        vandors: [existingVandor]
    })

    res.status(201).json(offer)

}


export const editOffer = async (req: Request, res: Response) => {

    const { id:offerId } = req.params
    const { title, description, offerType, offerAmount, pincode, promocode, 
        promoType, startValididty, endValididty, bank, bins, minValue, isActive } = <CreateOfferDto>req.body

    const existingVandor = await Vandor.findById(req.user._id)
    if(!existingVandor) return res.status(400).json({ message: "Vandor not found" })

    const existingOffer = await Offer.findById(offerId)
    if(!existingOffer) return res.status(400).json({ message: "Offer not found" })
    
    if(existingOffer.vandors) {
        const vandors = existingOffer.vandors as [VandorDoc]
        const isVandorExist = vandors.find(vandor => vandor.toString() == existingVandor._id)
        if(!isVandorExist && offerType === 'VANDOR') {
            return res.status(403).json({ message: "Unauthorized to edit offer" })
        }
    }

    existingOffer.title = title
    existingOffer.description = description
    existingOffer.offerType = offerType
    existingOffer.offerAmount = offerAmount
    existingOffer.pincode = pincode
    existingOffer.promocode = promocode
    existingOffer.promoType = promoType
    existingOffer.startValididty = startValididty
    existingOffer.endValididty = endValididty
    existingOffer.bank = bank
    existingOffer.bins = bins
    existingOffer.minValue = minValue
    existingOffer.isActive = isActive

    const editedOffer = await existingOffer.save()

    res.status(200).json(editedOffer)

}

