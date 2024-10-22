import { IsNotEmpty, IsNumber, IsString, IsEnum, IsDate, ValidationArguments } from "class-validator";
const isNumberMessage = (validationArguments: ValidationArguments): string => {
    return `${validationArguments.property}: ต้องเป็นตัวเลข`;
}

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber({}, { message: isNumberMessage })
    @IsNotEmpty()
    amount: number;

    @IsNumber({}, { message: isNumberMessage })
    @IsNotEmpty()
    quantity: number;

}