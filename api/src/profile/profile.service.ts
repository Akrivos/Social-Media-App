import { Injectable } from "@nestjs/common";
import { Post } from "src/entities/Post";
import { Profile } from "src/entities/Profile";
import { User } from "src/entities/User";
import { getRepository } from "typeorm";
import { EditProfileDTO } from "./profile.dto";

@Injectable()
export class ProfileService{
    constructor(){}

    //, body:EditProfileDTO
    async editProfile(userID:number,body:EditProfileDTO):Promise<any>{
        const findUser = await getRepository(User).findOne({relations:['userHasProfile'], where:{ id: userID }})
        console.log("FILE")
        //console.log(file)
        if(findUser.userHasProfile !== null){
            //await User.update({id:userID},{name:body.name, surname:body.surname})
            const findProfile = await Profile.findOne({id: findUser.userHasProfile.id})
            findProfile.about = body.about;
            findProfile.image = body.image;
            //(file !== undefined) ? findProfile.image = file.path : null
            findUser.name = body.name;
            findUser.surname = body.surname;
            findUser.userHasProfile = findProfile; 
            
            await findProfile.save()
            //await User.save()
            await findUser.save();
            return findUser;
        }else{
            //await User.update({id:userID},{name:body.name, surname:body.surname})
            const newProfile = new Profile();
            newProfile.about = body.about;
            newProfile.image = body.image;
            //(file !== undefined) ? newProfile.image = file.path : null
            newProfile.profileOfUser = findUser;
            
            findUser.name = body.name;
            findUser.surname = body.surname;
            findUser.userHasProfile = newProfile;
            await newProfile.save();
            await findUser.save();
            return findUser;
        }
    }


    async getProfileOfAUser(userID:number){
        const findProfileOfUser = getRepository(User).findOne({relations:['userHasProfile'], where:{ id: userID }})
        return findProfileOfUser;
    }

    async getAllProfiles(){
        const findAllProfiles = await Profile.find();
        return findAllProfiles
    }

    async setProfileImage(userID:number, imageFile){
        const user = await getRepository(User).findOne({relations:['userHasProfile'], where:{id: userID}});
        //console.log("ImageFile")
        //console.log(imageFile.path)
        if(user.userHasProfile !== null){
            const findProfile = await Profile.findOne({id: user.userHasProfile.id});

            findProfile.image = imageFile.path;
            user.userHasProfile = findProfile;

            await user.save();
            await findProfile.save();

            return {message: `User with id: ${user.id} has new imageUrl ${imageFile.path}`};
        }else{
            const newProfile = new Profile();
            newProfile.image = imageFile.path;
            //console.log(imageUrl)
            user.userHasProfile = newProfile;

            await newProfile.save();
            await user.save();
            return {message: `User with id: ${user.id} has new imageUrl ${imageFile.path}`};
        }
   }

}