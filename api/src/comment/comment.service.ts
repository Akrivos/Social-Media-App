import { Injectable } from "@nestjs/common";
import { Comment } from "src/entities/Comment";
import { Post } from "src/entities/Post";
import { Profile } from "src/entities/Profile";
import { User } from "src/entities/User";
import { getRepository } from "typeorm";
import { CreateCommentDTO } from "./comment.dto";

@Injectable()
export class CommentService{
    constructor(){}

    async createComment(body:CreateCommentDTO){
        const user = await User.findOne({id:body.userID});
        //const findUser = await getRepository(User).findOne({relations:['userHasProfile'], where:{id: body.userID}})
        const post = await Post.findOne({id:body.postID});
        const findPost = await getRepository(Post).findOne({relations:['postHasComment'], where:{id: body.postID}});
        const findProfile = await getRepository(Profile).find({relations:['profileOfUser']});
        const profileOfUser = findProfile.find(profile=> profile.profileOfUser.id === user.id)
        const date = new Date().toString();
        
        const newComment = new Comment();
        newComment.comment = body.comment;
        newComment.sendDate = date;
        newComment.commentOfPost = post;
        newComment.commentOfUser = user;
        newComment.commentOfProfile = profileOfUser;
        await newComment.save();

        findPost.postHasComment.push(newComment)
        await findPost.save();
        
        return null;

        // return await Comment.insert({
        //     comment: body.comment,
        //     sendDate: date,
        //     commentOfPost: findPost,
        //     commentOfUser: findUser
        // })
    }

    async getAllCommentsOfPostID(postID:number){
        const getCommentsOfPost = await getRepository(Comment).find({relations:['commentOfPost', 'commentOfUser', 'commentOfProfile'] , where:{ commentOfPost:{id:postID}}})
        const commentsSortedBy = getCommentsOfPost.sort((a,b)=>{
            const dateA = new Date(a.sendDate);
            const dateB = new Date(b.sendDate);
            return Math.abs(<any>dateA) - Math.abs(<any>dateB);
        })
        return getCommentsOfPost;
    }

    async getAllComments(){
        const getAllComments = await Comment.find();
        return getAllComments;
    }

    async deleteComment(commentID:number){
        return await Comment.delete({id:commentID});
    }

    async countCommentsOfPostID(postID:number){
        const findPostComments = await getRepository(Post).findOne({relations:['postHasComment'], where:{id: postID}});
        let countComments = 0;
        findPostComments.postHasComment.map(comment=>{
            countComments++
        })

        return countComments;
    }
}