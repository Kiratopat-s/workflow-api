import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role, User } from "../entities/user.entity";

export class CreateUserDto implements Partial<User> {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
}
