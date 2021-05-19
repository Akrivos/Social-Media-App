import { Body, Injectable } from "@nestjs/common";
import { User } from "src/entities/User";
import { getRepository } from "typeorm";
import { CreateUserDTO, SignInUser } from "./user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Profile } from "src/entities/Profile";
import { profile } from "console";

@Injectable()
export class UserService{
    constructor(
        private jwtService:JwtService
    ){}

    async getAllUsers():Promise<User[]>{
        const findAllUsers = await User.find();
        return findAllUsers;
    }

    async getUser(userID:number){
        const findUser = await getRepository(User).findOne({relations:['userHasProfile'], where:{ id: userID }});
        return findUser;
    }

    async getUserByEmail(email:string){
        const findUser = await getRepository(User).findOne({relations:['userHasProfile'], where:{ email: email }});
        return findUser;
    }

    async signUp(body:CreateUserDTO):Promise<any>{
        const months = [ 
            "January", "February",  
            "March", "April", "May",  
            "June", "July", "August", 
            "September", "October",  
            "November", "December" 
        ]; 
        const findIfEmailExist = await User.find({email:body.email});
        console.log(findIfEmailExist)
        if(findIfEmailExist.length===0){
            const date = new Date();
            //const currentMonth = date.toLocaleString("default", { month: "short" });
            const joinedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(body.password, salt);
            await User.insert({...body, joinedDate: joinedDate , password:hash});
            return { message:"Your account has been created successfully." };
        }else{
            return {message:"That email address already exists."}
        }
    }

    async signIn(body:SignInUser):Promise<{id:number,name:string, email:string , accessToken:string , status:boolean , message:string}>{
        const findUserByEmail = await User.findOne({email:body.email});
        if(findUserByEmail){
            const validate = await findUserByEmail.validatePassword(body.password,findUserByEmail.password)
            if(validate === true){
                const accessToken = this.jwtService.sign({email:findUserByEmail.email , password:findUserByEmail.password});
                const email= findUserByEmail.email;
                const message= "Success";
                const status = true;
                const name = findUserByEmail.name;
                const id = findUserByEmail.id;
                return {id, name, email , accessToken , status , message };
            }else{
                return {id:null ,name:null,  email:null, accessToken:null,status: false , message:"Invalid Credentials" }
            }
        }else{
            return {id:null, name:null, email:null, accessToken:null, status: false , message:"That email does not exist. Please Try again." }
        }
    }


    async deleteUser(userID:number){
        const findUser = await User.findOne({id:userID});
        if(findUser.userHasProfile){
            await Profile.delete({id: findUser.userHasProfile.id})
        }
        return  await User.delete({id:userID});
    }
}