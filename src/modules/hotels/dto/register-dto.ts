import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    surname: string = "";

    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    telephone: string;
}