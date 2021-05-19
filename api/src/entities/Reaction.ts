import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Reaction extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    type:string;

    //------------- Post - Reaction ------------------//
    @ManyToOne(
        ()=>Post, post=>post.postHasReaction, {onDelete:'CASCADE'}
    )
    reactionForPost:Post;

    //-------------- User - Reaction -----------------//
    @ManyToOne(
        ()=>User, user=>user.userHasReaction , {onDelete:'CASCADE'}
    )
    reactionFromUser:User;

    //-------------- Comment - Reaction --------------//
    @ManyToOne(
        ()=>Comment, comment=>comment.commentHasReaction , {onDelete:'CASCADE'}
    )
    reactionForComment:Comment;
}