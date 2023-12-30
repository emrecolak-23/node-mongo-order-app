import express, { Application } from "express";
import path from "path"
import dotenv from "dotenv";
dotenv.config();
import { AdminRoutes, VandorRoutes, ShoppingRoutes, CustomerRoutes } from "../routes";


export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, 'images')))

    app.use('/admin', AdminRoutes);
    app.use('/vandors', VandorRoutes);
    app.use('/user', CustomerRoutes)
    app.use('/shopping', ShoppingRoutes);

    return app
}