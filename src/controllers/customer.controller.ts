import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  CustomerDto,
  UserLoginDto,
  EditUserDto,
  OrderDto,
  CartItemDto,
} from "../dto";
import {
  generateSalt,
  generatePassword,
  onRequestOtp,
  generateOTP,
  generateSignature,
  comparePassword,
} from "../utility";
import { Offer, Transaction, Order, Food, Customer, Vandor, DeliveryUser } from "../models";

export const signUp = async (req: Request, res: Response) => {
  const customerInputs = plainToClass(CustomerDto, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0)
    return res.status(400).json({ message: inputErrors });

  const { email, password, phone } = customerInputs;

  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);
  const { otp, expiry: otpExpiry } = generateOTP();

  const existingUser = await Customer.findOne({ email });

  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

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
    lng: 0,
    orders: [],
  });

  if (!result)
    return res.status(400).json({ message: "Error creating customer" });

  // send the otp to customer
  await onRequestOtp(otp, phone);

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

export const login = async (req: Request, res: Response) => {
  const loginInputs = plainToClass(UserLoginDto, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (loginErrors.length > 0)
    return res.status(400).json({ message: loginErrors });

  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email });
  if (!customer)
    return res.status(400).json({ message: "Invalid login credentials" });
  const { salt, password: userPassword } = customer;
  const validationPassword = await comparePassword(
    password,
    userPassword,
    salt
  );
  if (!validationPassword)
    return res.status(400).json({ message: "Invalid login credentials" });
  const signature = generateSignature({
    _id: customer._id,
    email: customer.email,
    verified: customer.verified,
  });

  res.status(200).json({
    signature,
    verified: customer.verified,
    email: customer.email,
  });
};

export const verify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const user = req.user;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const profile = await Customer.findById(user._id);

  if (!profile) return res.status(400).json({ message: "Invalid user" });

  if (profile.otp !== otp || profile.otpExpiry < new Date())
    return res.status(400).json({ message: "Invalid OTP" });

  profile.verified = true;
  const updatedCustomer = await profile.save();

  const signature = generateSignature({
    _id: updatedCustomer._id,
    email: updatedCustomer.email,
    verified: updatedCustomer.verified,
  });

  res.status(200).json({
    signature,
    verified: updatedCustomer.verified,
    email: updatedCustomer.email,
  });
};

export const requestOTP = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const profile = await Customer.findById(user._id);

  if (!profile) return res.status(400).json({ message: "Invalid user" });

  const { otp, expiry: otpExpiry } = generateOTP();

  profile.otp = otp;
  profile.otpExpiry = otpExpiry;

  await profile.save();

  await onRequestOtp(otp, profile.phone);

  res.status(200).json({ message: "OTP sent your registered phone number" });
};

export const getProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.status(400).json({ message: "Invalid user" });

  const profile = await Customer.findById(user._id);

  if (!profile) return res.status(400).json({ message: "Invalid user" });

  res.status(200).json(profile);
};

export const updateProfile = async (req: Request, res: Response) => {
  const editCustomerInput = plainToClass(EditUserDto, req.body);
  const editCustomerErrors = await validate(editCustomerInput, {
    validationError: { target: true },
  });

  if (editCustomerErrors.length > 0)
    return res.status(400).json({ message: editCustomerErrors });

  const profile = await Customer.findById(req.user?._id);
  if (!profile) return res.status(400).json({ message: "Invalid user" });

  const { firstName, lastName, address } = editCustomerInput;

  profile.firstName = firstName;
  profile.lastName = lastName;
  profile.address = address;

  const updatedCustomer = await profile.save();

  res.status(200).json(updatedCustomer);
};

export const addToCart = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer)
    return res.status(400).json({ message: "Unable to create cart" });

  const { _id, unit } = <CartItemDto>req.body;
  let cartItems = Array();

  const profile = await Customer.findById(customer._id).populate("cart.food");
  if (!profile)
    return res.status(400).json({ message: "Unable to create cart" });

  const food = await Food.findById(_id);
  if (!food) return res.status(400).json({ message: "Invalid food item" });

  cartItems = profile.cart;
  if (cartItems.length > 0) {
    const existingItem = cartItems.find((item) => item.food._id == _id);
    if (existingItem) {
      const index = cartItems.indexOf(existingItem);
      if (unit > 0) {
        cartItems[index].unit += unit;
      } else {
        cartItems.splice(index, 1);
      }
      console.log(cartItems, "cartItems");
    }
  } else {
    cartItems.push({ food, unit });
  }

  profile.cart = cartItems;
  await profile.save();

  res
    .status(200)
    .json({ message: "Cart updated successfully", cart: profile.cart });
};

export const getCart = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(400).json({ message: "Customer not found" });

  const profile = await Customer.findById(customer._id).populate("cart.food");
  if (!profile) return res.status(400).json({ message: "Profile not found" });
  res.status(200).json(profile.cart);
};

export const deleteCart = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(400).json({ message: "Customer not found" });
  const profile = await Customer.findById(customer._id).populate("cart.food");
  if (!profile) return res.status(400).json({ message: "Profile not found" });
  if (profile.cart.length == 0)
    return res.status(400).json({ message: "Cart is already empty" });
  profile.cart = [];
  await profile.save();
  res.status(200).json({ message: "Cart deleted successfully" });
};

export const createPayment = async (req: Request, res: Response) => {
  const customer = req.user;
  const { amount, paymentMode, offerId } = req.body;
  let payableAmount = Number(amount);

  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);
    if (!appliedOffer)
      return res.status(400).json({ message: "Invalid offer" });
    if (appliedOffer.isActive) {
      payableAmount = payableAmount - appliedOffer.offerAmount;
    }
  }

  // Perform Payment Gateway charge Apı call

  // right after payment gateway success / failure response

  // create record on Transaction
  const transaction = await Transaction.create({
    customer: customer?._id,
    vandorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN", // FAILED // SUCCESS
    paymentMode,
    paymentResponse: "Payment is Cash on Delivery",
  });

  res
    .status(200)
    .json({
      message: "Payment created successfully",
      transactionId: transaction._id,
    });
};

const assignOrderForDelivery = async (orderId: string, vandorId: string) => {
    // find the vandor
    const vandor = await Vandor.findById(vandorId)
    const areaCode = vandor?.pincode
    const vandorLat = vandor?.lat
    const vandorLng = vandor?.lng
    
    // find the available delivery person
    const deliveryUsers = await DeliveryUser.find({ pincode: areaCode, isAvailable: true, verified: true })
    console.log(deliveryUsers, "deliveryUsers")
    if(!deliveryUsers.length) return "No delivery person available"
    // check the nearest delivery person and assign the order
    const currentOrder = await Order.findById(orderId)
    console.log(deliveryUsers[0]._id, "deliveryUsers[0]._id")
    if(!currentOrder) return "Invalid order"
    currentOrder.deliverId = deliveryUsers[0]._id
    await currentOrder.save()

    // Notify to Vendor for received New Order using Firebase Push Notification


}


const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);
  if (currentTransaction) {
    if (currentTransaction?.status.toLowerCase() !== "failed")
      return { status: true, currentTransaction };
  }

  return { status: false, currentTransaction };
};

export const createOrder = async (req: Request, res: Response) => {
  const customer = req.user;
  const { txnId, amount, items: cart } = <OrderDto>req.body;

  const { status, currentTransaction } = await validateTransaction(txnId);

  if (!status)
    return res.status(400).json({ message: "Error with create order" });

  const orderId = `${Math.floor(Math.random() * 899999) + 100000}`;
  const profile = await Customer.findById(customer?._id);

  let cartItems = Array();
  let netAmount = 0.0;
  let vandorId;

  const foods = await Food.find()
    .where("_id")
    .in(cart.map((item) => item._id))
    .exec();

  foods.forEach((food) => {
    cart.forEach(({ _id, unit }) => {
      if (food._id == _id) {
        vandorId = food.vandorId;
        netAmount += food.price * unit;
        cartItems.push({
          food,
          unit,
        });
      }
    });
  });

  if (cartItems.length == 0)
    return res.status(400).json({ message: "Invalid cart" });

  const currentOrder = await Order.create({
    orderId,
    vandorId,
    items: cartItems,
    totalAmount: netAmount,
    paidAmount: amount,
    orderDate: new Date(),
    orderStatus: "Pending",
    remarks: "",
    deliverId: "",
    readyTime: 45,
  });

  
  currentTransaction.vandorId = vandorId;
  currentTransaction.orderId = currentOrder._id;
  currentTransaction.status = "CONFIRMED";
  await currentTransaction.save();

  assignOrderForDelivery(currentOrder._id, vandorId)

  profile?.orders.push(currentOrder);
  profile.cart = [] as any;
  await profile?.save();

  res
    .status(200)
    .json({ message: "Order created successfully", order: currentOrder });
};

export const getOrders = async (req: Request, res: Response) => {
  const customer = req.user;

  const profile = await Customer.findById(customer?._id).populate("orders");

  res.status(200).json(profile?.orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const customer = req.user;
  const { id } = req.params;

  const profile = await Customer.findById(customer?._id).populate("orders");

  const order = profile?.orders.find((order) => order._id == id);

  res.status(200).json(order);
};

export const verifyOffer = async (req: Request, res: Response) => {
  const offerId = req.params.id;
  const user = req.user;
  if (!user) return res.status(400).json({ message: "Invalid user" });
  const appliedOffer = await Offer.findById(offerId);
  if (!appliedOffer) return res.status(400).json({ message: "Invalid offer" });
  if (appliedOffer.promoType === "USER") {
    // only can apply once per user
  }
  if (!appliedOffer.isActive)
    return res.status(400).json({ message: "Offer is not active" });

  res.status(200).json({ message: "Offer is valid", offer: appliedOffer });
};
