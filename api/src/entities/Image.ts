import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { Profile } from "./Profile";
import { User } from "./User";

@Entity()
export class Image extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    imageFileName:string;

    //----------- Profile - Image --------//
    // @ManyToMany(
    //     ()=>Profile , profile=>profile.profileHasImage
    // )
    // imageOfProfile:Profile[];

    // //------------- User - Image --------------//
    // @ManyToOne(
    //     ()=>User, user=>user.userHasImage
    // )
    // imageOfUser:User;

    // //--------------- Post - Image ------------//
    // @ManyToMany(
    //     ()=>Post, post=>post.postHasImage
    // )
    // imageOfPost:Post[]
}