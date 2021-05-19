import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { FollowDTO } from "./follower.dto";
import { FollowerService } from "./follower.service";

@Controller('/follower')
@ApiTags('Follower')
export class FollowerController{
    constructor( private followerService:FollowerService){}

    @Post('/follow')
    @ApiBody({type:FollowDTO})
    follow(@Body() body:FollowDTO){
        try{
            return this.followerService.follow(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }


    @Post('/followBack')
    @ApiBody({type:FollowDTO})
    followBack(@Body() body:FollowDTO){
        try{
            return this.followerService.followBack(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/getAllFriendsPostsAndProfilesOfUserID/:userID')
    getAllFriendsPostsAndProfilesOfUserID(@Param('userID') userID:number){
        try{
            return this.followerService.getAllFriendsPostsAndProfilesOfUserID(userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/findUnfollowedUsers/:userID')
    findUnfollowedUsers(@Param('userID') userID:number){
        try{
            return this.followerService.findUsersWhoDontFollowUserID(userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Delete('/unfollow/:userID/:followerID')
    unfollow(@Param('userID') userID:number, @Param('followerID') followerID:number){
        try{
            return this.followerService.unfollow(userID, followerID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/findFollowingsOfUserID/:userID')
    findFollowingOfUserID(@Param('userID') userID:number){
        try{
            return this.followerService.findUsersThatFollowTheUserID(userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/findPendingFollowsOfUserID/:userID')
    findPendingFollowsOfUserID(@Param('userID') userID:number){
        try{
            return this.followerService.findPendingFollowsOfUserID(userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/followersOfUserID/:userID')
    getFollowersOfUserID(@Param('userID') userID:number){
        try{
            return this.followerService.findFollowersOfUserID(userID)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/checkIfIsInFriendList/:userID/:navigateUserID')
    checkIfIsInFriendList(@Param('userID') userID:number, @Param('navigateUserID') navigateUserID:number){
        try{
            return this.followerService.checkIfIsInFriendList(userID,navigateUserID)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }
}