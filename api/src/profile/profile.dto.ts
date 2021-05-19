import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class EditProfileDTO{
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?:string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    surname?:string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    about?:string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    image?:string
}