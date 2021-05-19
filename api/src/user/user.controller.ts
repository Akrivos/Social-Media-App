import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { User } from "src/entities/User";
import { CreateUserDTO, SignInUser } from "./user.dto";
import { UserService } from "./user.service";

@Controller('/user')
@ApiTags('User')
export class UserController{
    constructor(private userService:UserService){}

    @Get('/getUser/:userID')
    getUser(@Param('userID') userID:number){
        try{
            return this.userService.getUser(userID)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get('/getUserByEmail/:email')
    getUserByEmail(@Param('email') email:string){
        try{
            return this.userService.getUserByEmail(email)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Get()
    getAllUsers():Promise<User[]>{
        try{
            return this.userService.getAllUsers()
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @ApiBody({type:CreateUserDTO})
    @Post('/signup')
    signUpUser(@Body() body:CreateUserDTO):Promise<CreateUserDTO>{
        try{
            return this.userService.signUp(body)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @ApiBody({type:SignInUser})
    @Post('/signin')
    signInUser(@Body() body:SignInUser):Promise<{name:string, email:string , accessToken:string , status:boolean , message:string}>{
        try{
            return this.userService.signIn(body)
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

    @Delete('/deleteUser/:userID')
    deleteUser(@Param('userID') userID:number){
        try{
            return this.userService.deleteUser(userID);
        }catch(e){
            Logger.error(e, e);
            throw new InternalServerErrorException(e);
        }
    }

}