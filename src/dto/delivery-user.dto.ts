import { IsEmail, Length } from "class-validator"

export class DeliveryUserDto {

    @IsEmail()
    email: string

    @Length(7, 12)
    phone: string

    @Length(3, 12)
    password: string

    @Length(3, 12)
    firstName: string

    @Length(3, 12)
    lastName: string

    @Length(6, 24)
    address: string

    @Length(4, 12)
    pincode: string

}