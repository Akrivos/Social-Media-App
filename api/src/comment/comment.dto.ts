import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCommentDTO{
    @IsNumber()
    @ApiProperty()
    userID:number;

    @IsNumber()
    @ApiProperty()
    postID:number;

    @IsString()
    @ApiProperty()
    comment:string;
}