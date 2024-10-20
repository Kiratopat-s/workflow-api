import { IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
import { Item } from "../entities/item.entity";

export class CreateItemDto implements Partial<Item> {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsOptional()
    contactMobileNo: string;

}