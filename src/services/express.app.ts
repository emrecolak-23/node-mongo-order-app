import express, { Application } from "express";
import path from "path"
import dotenv from "dotenv";
dotenv.config();
import { AdminRoutes, VandorRoutes, ShoppingRoutes, CustomerRoutes, DeliveryRoutes } from "../routes";


export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    const imagePath = path.join(__dirname, '..', 'images')
    app.use('/images', express.static(imagePath))

    app.use('/admin', AdminRoutes);
    app.use('/vandors', VandorRoutes);
    app.use('/user', CustomerRoutes)
    app.use('/shopping', ShoppingRoutes);
    app.use('/delivery', DeliveryRoutes)

    return app
}