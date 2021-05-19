import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateCommentToPostDTO, CreatePostDTO, UpdatePostSendType } from "./post.dto";
import { PostService } from "./post.service";
import { diskStorage } from  'multer';

@Controller('/post')
@ApiTags('Post')
export class PostController{
    constructor(private postService:PostService){}


    @Post('/createPost/:userID')
    @ApiBody({type:CreatePostDTO})
    userCreatesPost(@Param('userID') userID:number, @Body() body:CreatePostDTO){
        try{
            return this.postService.userCreatesPost(userID,body);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Get("/getPostsOfUser/:userID")
    getPostsOfUserID(@Param('userID') userID:number){
        try{
            return this.postService.getPostsOfUserID(userID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Get("/getPublicPostsOfUser/:userID")
    getPublicPostsOfUserID(@Param('userID') userID:number){
        try{
            return this.postService.getPublicPostsOfUserID(userID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Get("/getPublicAndFriendsPostsOfUser/:userID")
    getPublicAndFriendsPostsOfUserID(@Param('userID') userID:number){
        try{
            return this.postService.getPublicAndFriendsPostsOfUserID(userID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Delete('/deletePost/:userID/:postID')
    deletePost(@Param('userID') userID:number, @Param('postID') postID:number){
        try{
            return this.postService.deletePost(userID,postID);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('photo',{
        storage: diskStorage({
            destination: './postImages', 
            filename: (req, file, cb) => {
                //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                //return cb(null, `${randomName}${extname(file.originalname)}`)
                return cb(null, file.originalname)
            }})
    }))
    uploadImagee(@UploadedFile() file) {
        console.log(file)
    }

    @Get('/image/:imgName')
    seeUploadedFile(@Param('imgName') imgName, @Res() res){
        return res.sendFile(imgName, {root: 'postImages'})
    }

    @Patch('/updatePost')
    @ApiBody({type:UpdatePostSendType})
    updatePostSendType(@Body() body: UpdatePostSendType){
        try{
            return this.postService.updatePostSendType(body);
        }catch(e){
            Logger.error(e,e);
            throw new InternalServerErrorException(e);
        }  
    }

}