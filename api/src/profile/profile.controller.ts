import { Body, Controller, Get, InternalServerErrorException, Logger, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { EditProfileDTO } from "./profile.dto";
import { ProfileService } from "./profile.service";
import { diskStorage } from  'multer';
import { extname } from "path";

@Controller('/profile')
@ApiTags('Profile')
export class ProfileController{
    SERVER_URL:string = "http://localhost:5000/";
    constructor(private profileService:ProfileService){}


    @Post('/updateProfile/:userID')
    @ApiBody({type:EditProfileDTO})
    editProfile(@Param('userID') userID:number ,@Body() body:EditProfileDTO):Promise<any>{
        try{
            return this.profileService.editProfile(userID,body)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }


    @Get('/getAllProfiles')
    getAllProfiles(){
        try{
            return this.profileService.getAllProfiles()
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('getProfileOfUser/:userID')
    getProfileOfAUser(@Param('userID') userID:number){
        try{
            return this.profileService.getProfileOfAUser(userID)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }


    // @Post('/image')
    // @UseInterceptors(FileInterceptor('photo',{
    //     storage: diskStorage({
    //         destination: './profileImages', 
    //         filename: (req, file, cb) => {
    //             //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    //             //return cb(null, `${randomName}${extname(file.originalname)}`)
    //             return cb(null, file.originalname)
    //         }})
    // }))
    // uploadImagee(@UploadedFile() file) {
    //     console.log(file)
    //     // try{
    //     //     return this.profileService.setProfileImage(userID, file);
    //     //     //return this.profileService.setProfileImage(userID, `${file.path}`);
    //     // }catch(e){
    //     //     Logger.error(e, e);
    //     //     throw new InternalServerErrorException(e);
    //     // }
    //     //console.log("file")
    //    // console.log(file)
    //    //return this.profileService.setProfileImage(userID, `${this.SERVER_URL}${file.path}`);
    // }


    // @Post('/image/:userID')
    // @UseInterceptors(FileInterceptor('photo',{
    //     storage: diskStorage({
    //         destination: './profileImages', 
    //         filename: (req, file, cb) => {
    //             const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    //             return cb(null, `${randomName}${extname(file.originalname)}`)
    //         }})
    // }))
    // uploadImage(@Param('userID') userID, @UploadedFile() file) {
    //     console.log(file)
    //     try{
    //         return this.profileService.setProfileImage(userID, file);
    //         //return this.profileService.setProfileImage(userID, `${file.path}`);
    //     }catch(e){
    //         Logger.error(e, e);
    //         throw new InternalServerErrorException(e);
    //     }
    //     //console.log("file")
    //     console.log(file)
    //    //return this.profileService.setProfileImage(userID, `${this.SERVER_URL}${file.path}`);
    // }

    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('photo',{
        storage: diskStorage({
            destination: './profileImages', 
            filename: (req, file, cb) => {
                //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                //return cb(null, `${randomName}${extname(file.originalname)}`)
                return cb(null, file.originalname)
            }})
    }))
    uploadImagee(@UploadedFile() file) {
        console.log(file)
        console.log(`${this.SERVER_URL}${file.path}`)
        // try{
        //     return this.profileService.setProfileImage(userID, file);
        //     //return this.profileService.setProfileImage(userID, `${file.path}`);
        // }catch(e){
        //     Logger.error(e, e);
        //     throw new InternalServerErrorException(e);
        // }
        //console.log("file")
       // console.log(file)
       //return this.profileService.setProfileImage(userID, `${this.SERVER_URL}${file.path}`);
    }

    @Get('/image/:imgName')
    seeUploadedFile(@Param('imgName') imgName, @Res() res){
        return res.sendFile(imgName, {root: 'profileImages'})
    }

    // @Get('/image/:imgPath')
    // seeUploadedFile(@Param('imgPath') imgPath, @Res() res){
    //     return res.sendFile(`image/${imgPath}`, {root: 'profileImages'})
    // }
}