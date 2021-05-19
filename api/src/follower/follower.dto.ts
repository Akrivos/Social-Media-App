import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FollowDTO{
    @IsNumber()
    @ApiProperty()
    followingID:number;

    @IsNumber()
    @ApiProperty()
    followedID:number;
}