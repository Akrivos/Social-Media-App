import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateCommentDTO } from "./comment.dto";
import { CommentService } from "./comment.service";

@Controller('/comment')
@ApiTags('Comment')
export class CommentController{
    constructor(private commentService:CommentService){}

    @Get('/getCommentsOfPost/:postID')
    getAllCommentsOfPost(@Param('postID') postID:number){
        try{
            return this.commentService.getAllCommentsOfPostID(postID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Get('/getAllComments')
    getAllComments(){
        try{
            return this.commentService.getAllComments();
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }              
    }

    @Post('/createComment')
    @ApiBody({type:CreateCommentDTO})
    createComment(@Body() body:CreateCommentDTO){
        try{
            return this.commentService.createComment(body);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Delete('/deleteComment/:commentID')
    deleteComment(@Param('commentID') commentID:number){
        try{
            return this.commentService.deleteComment(commentID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Get('/countOfComments/:postID')
    getCountOfComments(@Param('postID') postID:number){
        try{
            return this.commentService.countCommentsOfPostID(postID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }
}