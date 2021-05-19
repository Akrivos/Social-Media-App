import { Module } from "@nestjs/common";
import { FollowerController } from "./follower.controller";
import { FollowerService } from "./follower.service";

@Module({
    imports:[],
    providers:[FollowerService],
    controllers:[FollowerController]
})
export class FollowerModule {}