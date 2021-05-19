import { Injectable } from "@nestjs/common";
import { Comment } from "src/entities/Comment";
import { Post } from "src/entities/Post";
import { Reaction } from "src/entities/Reaction";
import { User } from "src/entities/User";
import { getRepository } from "typeorm";
import { AddReactionToCommentDTO, AddReactionToPostDTO, UpdateReactionToComment, UpdateReactionToPost } from "./reaction.dto";

@Injectable()
export class ReactionService{
    constructor(){}

    //-------------REACTION FOR POST---------------------//

    async addReactionToPost(body:AddReactionToPostDTO){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForPost'], where:{
            reactionFromUser:{id:body.userID}, reactionForPost:{id:body.postID}}
        });

        if(findReactionOfUser){
            return await Reaction.update({id: findReactionOfUser.id}, {type: body.type});
        }

        const findUser = await User.findOne({id:body.userID});
        const post = await Post.findOne({id:body.postID});
        const findPostReaction = await getRepository(Post).findOne({relations:['postHasReaction'], where:{id: body.postID}});

        const newReaction = new Reaction();
        newReaction.type = body.type;
        newReaction.reactionForPost = post;
        newReaction.reactionFromUser = findUser;
        await newReaction.save();

        findPostReaction.postHasReaction.push(newReaction);
        await findPostReaction.save()
        return findPostReaction;
    }

    async getReactionOfUserToPost(userID:number, postID:number){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForPost'], where:{
            reactionFromUser:{id: userID}, reactionForPost:{id: postID}}
        });
        return findReactionOfUser;
    }

    async getAllReactionsOfPostID(postID:number){
        const getAllReactionsOfPost = getRepository(Reaction).find({relations:['reactionFromUser', 'reactionForPost'], where:{reactionForPost:{id:postID}}});
        return getAllReactionsOfPost;
    }

    async deleteReactionFromPost(postID:number,userID:number){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForPost'], where:{reactionFromUser:{id:userID}, reactionForPost:{id:postID}}})
        console.log(findReactionOfUser)
        return await Reaction.delete({id: findReactionOfUser.id})
    }

    async updateReactionToPost(body:UpdateReactionToPost){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForPost'], where:{reactionFromUser:{id:body.userID}, reactionForPost:{id:body.postID}}});
        return await Reaction.update({id: findReactionOfUser.id}, {type: body.type});
    }

    async countReactionsAndCommentsOfPost(postID:number){
        let countLikes = 0;
        let countDislikes = 0;
        let countComments = 0;

        const findPostComments = await getRepository(Post).findOne({relations:['postHasComment'], where:{id: postID}});
        const findReactionOfUser = await getRepository(Reaction).find({relations:['reactionForPost'], where:{reactionForPost:{id: postID}}});

        findPostComments.postHasComment.map(comment=>{
            countComments++
        })

        findReactionOfUser.map(reaction=>{
            if( reaction.type === 'like'){
                countLikes++
            }else if( reaction.type === 'dislike'){
                countDislikes++
            }
        })

        return { countLikes, countDislikes, countComments };
    }

    //-------------- REACTION FOR COMMENT----------------//

    async addReactionToComment(body: AddReactionToCommentDTO){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForComment'], where:{
            reactionFromUser:{id:body.userID}, reactionForComment:{id:body.commentID}}
        });

        if(findReactionOfUser){
            return await Reaction.update({id: findReactionOfUser.id}, {type: body.type});
        }

    
        const findUser = await User.findOne({id: body.userID});
        const comment = await Comment.findOne({id: body.commentID});
        const findCommentReaction = await getRepository(Comment).findOne({relations:['commentHasReaction'], where:{id: body.commentID}});

        const newReaction = new Reaction();
        newReaction.type = body.type;
        newReaction.reactionFromUser = findUser;
        newReaction.reactionForComment = comment;
        await newReaction.save();

        findCommentReaction.commentHasReaction.push(newReaction);
        await findCommentReaction.save();
        return findCommentReaction;
    }

    async getAllReactionsOfCommentID(commentID:number){
        const findAllReactionsOfComment = await getRepository(Reaction).find({relations:['reactionFromUser', 'reactionForComment'],
                where:{ reactionForComment:{id:commentID} }});
        return findAllReactionsOfComment;        
    }

    async getReactionOfUserToComment(userID:number, commentID:number){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForComment'], where:{
            reactionFromUser:{id: userID}, reactionForComment:{id: commentID}}
        });
        return findReactionOfUser;
    }


    async deleteReactionFromComment(commentID:number, userID:number){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForComment'], where:{reactionFromUser:{id:userID}, reactionForComment:{id:commentID}}});
        return await Reaction.delete({id: findReactionOfUser.id})
    }

    async updateReactionToComment(body:UpdateReactionToComment){
        const findReactionOfUser = await getRepository(Reaction).findOne({relations:['reactionFromUser', 'reactionForComment'], where:{reactionFromUser:{id: body.userID}, reactionForComment:{id: body.commentID}}});
        return await Reaction.update({id: findReactionOfUser.id}, {type: body.type});
    }

    async countReactionsOfComment(commentID:number){
        const findReactionOfUser = await getRepository(Reaction).find({relations:['reactionForComment'], where:{reactionForComment:{id:commentID}}});
        let countLikes = 0;
        let countDislikes = 0;
        findReactionOfUser.map(reaction => {
            if(reaction.type === 'like'){
                countLikes++
            }else if(reaction.type === 'dislike'){
                countDislikes++
            }
        })
        return {countLikes, countDislikes}
    }

}