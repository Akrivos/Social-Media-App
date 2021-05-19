import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { POINT_CONVERSION_HYBRID } from "constants";
import { AddReactionToCommentDTO, AddReactionToPostDTO, UpdateReactionToComment, UpdateReactionToPost } from "./reaction.dto";

import { ReactionService } from "./reaction.service";

@Controller('/reaction')
@ApiTags('Reaction')
export class ReactionController{
    constructor(private reactionService:ReactionService){}

    //--------------- REACTION FOR POST -------------//

    @Get('/getAllReactionsOfPost/:postID')
    getAllReactionOfPost(@Param('postID') postID:number){
        try{
            return this.reactionService.getAllReactionsOfPostID(postID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/getReactionOfUserToPost/:userID/:postID')
    getReactionOfUserToPost(@Param('userID') userID:number, @Param('postID') postID:number){
        try{
            return this.reactionService.getReactionOfUserToPost(userID, postID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Post('/addReactionToPost')
    @ApiBody({type: AddReactionToPostDTO})
    addReactionToPost(@Body() body:AddReactionToPostDTO){
        try{
            return this.reactionService.addReactionToPost(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Delete('/deleteReactionFromPost/:postID/:userID')
    deleteReactionFromPost(@Param('postID') postID:number, @Param('userID') userID:number){
        try{
            return this.reactionService.deleteReactionFromPost(postID,userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Patch('/updateReactionToPost')
    @ApiBody({type:UpdateReactionToPost})
    updateReactionToPost(@Body() body:UpdateReactionToPost){
        try{
            return this.reactionService.updateReactionToPost(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    //--------------REACTION FOR COMMENT------------------//

    @Get('/getAllReactionsOfComment/:commentID')
    getAllReactionOfComment(@Param('commentID') commentID:number){
        try{
            return this.reactionService.getAllReactionsOfCommentID(commentID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/getReactionOfUserToComment/:userID/:commentID')
    getReactionOfUserToComment(@Param('userID') userID:number, @Param('commentID') commentID:number){
        try{
            return this.reactionService.getReactionOfUserToComment(userID, commentID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }


    @Post('/addReactionToComment')
    @ApiBody({type: AddReactionToCommentDTO})
    addReactionToComment(@Body() body:AddReactionToCommentDTO){
        try{
            return this.reactionService.addReactionToComment(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Delete('/deleteReactionFromComment/:commentID/:userID')
    deleteReactionFromComment(@Param('commentID') commentID:number, @Param('userID') userID:number){
        try{
            return this.reactionService.deleteReactionFromComment(commentID,userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Patch('/updateReactionToComment')
    updateReactionToComment(@Body() body:UpdateReactionToComment){
        try{
            return this.reactionService.updateReactionToComment(body);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/countReactionsAndCommentsOfPost/:postID')
    countReactionsAndCommentsOfPOst(@Param('postID') postID:number){
        try{
            return this.reactionService.countReactionsAndCommentsOfPost(postID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/countReactionOfComment/:commentID')
    countReactionOfComment(@Param('commentID') commentID:number){
        try{
            return this.reactionService.countReactionsOfComment(commentID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }
}