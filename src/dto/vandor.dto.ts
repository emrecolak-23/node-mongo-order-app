export interface CreateVandorDto {
    name: string;
    ownerName: string;
    foodType: string;
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VandorUpdateDto {
    name: string;
    foodType: string[];
    address: string;
    phone: string;
}

export interface VandorLoginDto {
    email: string;
    password: string;
}

export interface VandorPayload {
    _id: string;
    email: string;
    name: string;
    foodType: string[];
    //
}