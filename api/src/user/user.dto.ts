import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsString, matches, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { Gender } from "src/entities/User";

export class CreateUserDTO{
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty()
    name:string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty()
    surname:string;

    @IsString()
    //@Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/)
    @ApiProperty()
    password:string;

    @IsString()
    @ApiProperty()
    dateOfBirth:string;

    @IsString()
    @ApiProperty()
    email:string

    @IsString()
    @ApiProperty()
    gender:Gender;

    // @IsString()
    // @ApiProperty()
    // joinedDate:string;
}

export class SignInUser{
    @IsString()
    @ApiProperty()
    email:string;

    @IsString()
    @ApiProperty()
    password:string
}