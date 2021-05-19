import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Image } from "./Image";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Profile extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true,default:''})
    about:string;

    @Column({nullable:true, default:''})
    image:string;

    // @OneToOne(
    //     ()=>User, {onDelete:'CASCADE'}
    // )
    // user:User;    
    
    //--------------- User - Profile --------------//
    @OneToOne(
        ()=>User , user => user.userHasProfile, {onDelete:'CASCADE'}
    )
    //@JoinColumn()
    profileOfUser:User

    //------------- Profile - Post ---------------//
    @OneToMany(
        ()=>Post, post=>post.postFromProfile, {onDelete:'CASCADE'}
    )
    profileHasPost:Post[];

    //------------- Comment - Profile ------------//
    @OneToMany(
        ()=>Comment, comment=>comment.commentOfProfile
    )
    profileHasComment:Comment[]
}