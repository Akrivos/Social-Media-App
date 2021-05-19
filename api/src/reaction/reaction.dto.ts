import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddReactionToPostDTO{
    @IsNumber()
    @ApiProperty()
    userID:number;

    @IsNumber()
    @ApiProperty()
    postID:number;

    @IsString()
    @ApiProperty()
    type:string;
}

export class AddReactionToCommentDTO{
    @IsNumber()
    @ApiProperty()
    userID:number;

    @IsNumber()
    @ApiProperty()
    commentID:number;

    // @IsNumber()
    // @ApiProperty()
    // postID:number;

    @IsString()
    @ApiProperty()
    type:string;
}

export class UpdateReactionToPost{
    @IsNumber()
    @ApiProperty()
    userID:number;

    @IsNumber()
    @ApiProperty()
    postID:number;

    @IsString()
    @ApiProperty()
    type:string;
}

export class UpdateReactionToComment{
    @IsNumber()
    @ApiProperty()
    userID:number;

    @IsNumber()
    @ApiProperty()
    commentID:number;

    // @IsNumber()
    // @ApiProperty()
    // postID:number;

    @IsString()
    @ApiProperty()
    type:string;
}