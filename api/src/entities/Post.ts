import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Image } from "./Image";
import { Profile } from "./Profile";
import { Reaction } from "./Reaction";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column("longtext")
    content:string;

    @Column()
    sendDate:string;

    @Column({nullable:true, default:''})
    image:string;

    @Column({default:"public"})
    sendType: string


    //------------- User - Post ---------------//
    @ManyToOne(
        ()=>User , user=>user.userHasPost, {onDelete:'CASCADE'}
    )
    postFromUser:User;

    //-------------- Post - Comment ----------//
    @OneToMany(
        ()=>Comment , comment=>comment.commentOfPost
    )
    postHasComment:Comment[]

    //------------- Post - Reaction ----------//
    @OneToMany(
        ()=>Reaction, reaction=>reaction.reactionForPost
    )
    postHasReaction:Reaction[];

    //---------- Profile - Post ----------------//
    @ManyToOne(
        ()=>Profile, profile=>profile.profileHasPost
    )
    postFromProfile:Profile;
}