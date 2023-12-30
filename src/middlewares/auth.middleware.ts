import { Request, Response, NextFunction } from "express";
import { validateSignature } from "../utility";
import { AuthPayload } from "../dto";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const authenticate = async (req:Request, res:Response, next: NextFunction) => {
   
    try {

        const signature = req.get("Authorization")

        if(!signature) return res.status(401).json({ message: "Unauthorized" })

        const [_, token] = signature.split(" ")

        const payload = await validateSignature(token)
        req.user = payload

        next()

    } catch (error:any) {

        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        } else {
            console.log(error);
            throw new Error(error.message);
        }

    }
    

}   