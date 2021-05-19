import { Injectable} from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NOTFOUND } from "dns";
import { Post } from "src/entities/Post";
import { Profile } from "src/entities/Profile";
import { User } from "src/entities/User";
import { User_Follower } from "src/entities/User_Follower";
import { Any, getRepository, In, Not } from "typeorm";
import { FollowDTO } from "./follower.dto";
import { FollowerModule } from "./follower.module";

@Injectable()
export class FollowerService{
    constructor(){}

    async follow(body:FollowDTO){
        const findFollowingUser = await User.findOne({id: body.followingID});
        const findFollowedUser = await User.findOne({id: body.followedID});
        await User_Follower.insert({userFollowing: findFollowingUser, userFollowed: findFollowedUser});

        const findFollower = await getRepository(User_Follower).findOne({relations:['userFollowing', 'userFollowed'], where:{ userFollowing:{id:findFollowingUser.id}, userFollowed:{id:findFollowedUser.id}}});
        const followingUser = await getRepository(User).findOne({relations:['following','followed'], where:{id: body.followingID}});
        followingUser.following.push(findFollower);
        await followingUser.save();
       // return followingUser;
       return null;
    }

    async followBack(body:FollowDTO){
        const findFollowingUser = await User.findOne({id: body.followingID});
        const findFollowedUser = await User.findOne({id: body.followedID});
        await User_Follower.insert({userFollowing: findFollowedUser, userFollowed: findFollowingUser});

        const findFollower = await getRepository(User_Follower).findOne({relations:['userFollowing', 'userFollowed'], where:{ userFollowing:{id:findFollowedUser.id}, userFollowed:{id:findFollowingUser.id}}});
        const followedUser = await getRepository(User).findOne({relations:['following','followed'], where:{id: body.followingID}}); 
        followedUser.followed.push(findFollower);
        await followedUser.save();
        return followedUser;
    }

    async unfollow(userID:number, followerID:number){
        const user_follower = await getRepository(User_Follower).findOne({relations:['userFollowing','userFollowed'], where:{userFollowing:{id: userID}, userFollowed:{id: followerID}}})
        return await User_Follower.delete({id: user_follower.id});

    }


    async getAllFriendsPostsAndProfilesOfUserID(userID:number){
        const findUsersThatFollowTheUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowing:userID}}); // asd
        const usersThatFollowedUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowed:userID}});
        const arrayOfFollowingIDOfUser = findUsersThatFollowTheUserID.map(follow=> follow.userFollowed.id);
        const arrayOfFollowersIDOfUser = usersThatFollowedUserID.map(follow=> follow.userFollowing.id)
        const arrayOfUsersThatFollowAndFollowBackUserID = arrayOfFollowingIDOfUser.filter(id=> arrayOfFollowersIDOfUser.includes(id)) 
        arrayOfUsersThatFollowAndFollowBackUserID.push(userID)

        const posts = await getRepository(Post).find({
            relations:['postFromUser','postFromProfile'], 
            where:{
                postFromUser:{id: In(arrayOfUsersThatFollowAndFollowBackUserID)}, 
                sendType: In(['public', 'friends']) 
            }
        });

        const sortedByDate = posts.sort((a,b)=>{
            const dateA = new Date(a.sendDate);
            const dateB = new Date(b.sendDate);
            return  Math.abs(<any>dateB) - Math.abs(<any>dateA);
        })
        return sortedByDate;
    }

    async checkIfIsInFriendList(userID:number, navigateUserID: number){
        const findUsersThatFollowTheUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowing:userID}}); // asd
        const usersThatFollowedUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowed:userID}});
        const arrayOfFollowingIDOfUser = findUsersThatFollowTheUserID.map(follow=> follow.userFollowed.id);
        const arrayOfFollowersIDOfUser = usersThatFollowedUserID.map(follow=> follow.userFollowing.id)
        const arrayOfUsersThatFollowAndFollowBackUserID = arrayOfFollowingIDOfUser.filter(id=> arrayOfFollowersIDOfUser.includes(id));

        if (arrayOfUsersThatFollowAndFollowBackUserID.includes(navigateUserID)){
            return true;
        }else{
            return false;
        }
    }


    async findUsersWhoDontFollowUserID(userID: number){
        const findUsersThatFollowingTheUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowing:userID}});
        const arrayOfFollowingsID = findUsersThatFollowingTheUserID.map(follow=>follow.userFollowed.id);
        arrayOfFollowingsID.push(userID);
        
        const findUsersWhoDontFollowTheUserID = await getRepository(User).find({
            relations:['userHasProfile'], where:{ id: Not(In(arrayOfFollowingsID))}
        });

        return findUsersWhoDontFollowTheUserID;
    }

    async findFollowersOfUserID(userID:number){
        const usersThatFollowedUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowed:userID}});
        console.log(usersThatFollowedUserID)
        const arrayOfFollowedsID = usersThatFollowedUserID.map(follow=>follow.userFollowing.id);
        console.log(arrayOfFollowedsID)

        const followedUsers = await getRepository(User).find({
            relations:['userHasProfile'], where:{ id: In(arrayOfFollowedsID)}
        });

        return followedUsers;
    }

    async findUsersThatFollowTheUserID(userID: number){
        const findUsersThatFollowTheUserID = await getRepository(User_Follower).find({relations:['userFollowing','userFollowed'], where:{userFollowing:userID}});
        const arrayOfUsersThatFollowTheUserID = findUsersThatFollowTheUserID.map( follow => follow.userFollowed.id);

        const getUsersThatFollowTheUserID = await getRepository(User).find({
            relations:['userHasProfile'], where:{ id: In(arrayOfUsersThatFollowTheUserID)}
        });

        return getUsersThatFollowTheUserID;
    }


    async findPendingFollowsOfUserID(userID:number){
        const pendingUsersArray = [];
        const mainUser = await getRepository(User).findOne({relations:['following', 'followed'], where:{id: userID}});
        const findAllUsers = await getRepository(User).find({relations:['following', 'followed']});

        await Promise.all(findAllUsers.map(async user=>{
            if((await this.checkIfIsPending(userID, user.id) === true) && !(mainUser.id === user.id)){
                pendingUsersArray.push(user);
            }else{
                return;
            }
        }))

        return pendingUsersArray;
    }

    async checkIfIsPending(mainUserID:number, userID:number){
        const following = await getRepository(User_Follower).findOne({relations:['userFollowing','userFollowed'], where:{userFollowing:{id: mainUserID}, userFollowed:{id: userID }}});
        const followed = await getRepository(User_Follower).findOne({relations:['userFollowing','userFollowed'], where:{userFollowing:{id: userID}, userFollowed:{id: mainUserID }}});
        if( followed && !following ){
            return true;
        }else{
            return false;
        }
    }
}