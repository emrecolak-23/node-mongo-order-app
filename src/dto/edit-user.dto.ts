import { Length } from "class-validator";

export class EditUserDto {

    @Length(2, 16)
    firstName: string;

    @Length(2, 16)
    lastName: string;

    @Length(6, 50)
    address: string;


}

