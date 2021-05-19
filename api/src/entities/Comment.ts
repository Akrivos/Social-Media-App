import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { Profile } from "./Profile";
import { Reaction } from "./Reaction";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column("longtext")
    comment:string;

    @Column()
    sendDate:string;

    //------------------ Post - Comment --------------//
    @ManyToOne(
        ()=>Post , post=>post.postHasComment, {onDelete:'CASCADE'}
    )
    commentOfPost:Post

    //--------------- User - Comment ----------------//
    @ManyToOne(
        ()=>User, user=>user.userHasComment, {onDelete:'CASCADE'}
    )
    commentOfUser:User;
    
    //--------------- Comment - Reaction -------------//
    @OneToMany(
        ()=>Reaction, reaction=>reaction.reactionForComment, {onDelete:'CASCADE'}
    )
    commentHasReaction:Reaction[];

    //---------------- Comment - Profile ---------------//
    @ManyToOne(
        ()=>Profile, profile=>profile.profileHasComment
    )
    commentOfProfile:Profile
}