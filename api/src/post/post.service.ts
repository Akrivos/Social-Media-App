import { Injectable } from "@nestjs/common";
import { Comment } from "src/entities/Comment";
import { Post } from "src/entities/Post";
import { Profile } from "src/entities/Profile";
import { User } from "src/entities/User";
import { getRepository, In } from "typeorm";
import { CreateCommentToPostDTO, CreatePostDTO, UpdatePostSendType } from "./post.dto";

@Injectable()
export class PostService{
    constructor(){}

    async userCreatesPost(userID:number, body:CreatePostDTO){
        const findUser = await getRepository(User).findOne({relations:['userHasProfile'], where:{id:userID}});
        const user = await getRepository(User).findOne({relations:['userHasPost'], where:{ id: userID }});
        const findProfile = await getRepository(Profile).find({relations:['profileOfUser']});
        const profileOfUser = findProfile.find(profile=>profile.profileOfUser.id === userID)
        const date = new Date().toString();

        const newPost = new Post();
        newPost.content = body.content;
        newPost.image = body.image;
        newPost.sendType = body.sendType;
        newPost.sendDate = date;
        newPost.postFromUser = findUser;
        (profileOfUser) ? newPost.postFromProfile = profileOfUser : null
        await newPost.save();
        
        user.userHasPost.push(newPost);
        await user.save()
        return user;
    }

    async getPostsOfUserID(userID:number){
        const findUser = await User.findOne({id:userID});
        const findPostsOfUserID = await getRepository(Post).find({relations:['postFromUser','postFromProfile'], where:{postFromUser:{ id:findUser.id}}});
        const postsSortedBy = findPostsOfUserID.sort((a,b)=>{
            const dateA = new Date(a.sendDate);
            const dateB = new Date(b.sendDate);
            return Math.abs(<any>dateB) - Math.abs(<any>dateA);
        })
        return postsSortedBy;
    }

    async getPublicPostsOfUserID(userID:number){
        const findUser = await User.findOne({id:userID});
        const findPostsOfUserID = await getRepository(Post).find({
            relations:['postFromUser','postFromProfile'], 
            where:{
                postFromUser:{ id:findUser.id}, 
                sendType:"public"
            }
        });
        const postsSortedBy = findPostsOfUserID.sort((a,b)=>{
            const dateA = new Date(a.sendDate);
            const dateB = new Date(b.sendDate);
            return Math.abs(<any>dateB) - Math.abs(<any>dateA);
        })
        return postsSortedBy;
    }

    async getPublicAndFriendsPostsOfUserID(userID:number){
        const findUser = await User.findOne({id:userID});
        const findPostsOfUserID = await getRepository(Post).find({
            relations:['postFromUser','postFromProfile'], 
            where:{
                postFromUser:{ id:findUser.id}, 
                sendType: In(['public', 'friends'])
            }
        });
        const postsSortedBy = findPostsOfUserID.sort((a,b)=>{
            const dateA = new Date(a.sendDate);
            const dateB = new Date(b.sendDate);
            return Math.abs(<any>dateB) - Math.abs(<any>dateA);
        })
        return postsSortedBy;
    }

    async deletePost(userID:number,postID:number){
        const findPostOfUser = await getRepository(User).findOne({relations:['userHasPost'], where:{id:userID}});
        findPostOfUser.userHasPost = findPostOfUser.userHasPost.filter(post=>post.id !== postID);
        await findPostOfUser.save();
        return await Post.delete({id:postID});
    }

    async updatePostSendType(body: UpdatePostSendType){
        await Post.update({ id: body.id}, {sendType: body.sendType})
        return null
    }
}