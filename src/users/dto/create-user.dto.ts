import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Role } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    description: string;
}
