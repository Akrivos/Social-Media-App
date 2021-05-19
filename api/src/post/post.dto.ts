import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDTO{
    @IsString()
    @ApiProperty()
    content:string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    image?:string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    sendType?:string
}

export class UpdatePostSendType{
    @IsNumber()
    @ApiProperty()
    id: number

    @IsString()
    @ApiProperty()
    sendType: string
}

export class CreateCommentToPostDTO{
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