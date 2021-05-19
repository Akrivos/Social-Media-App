import { BaseEntity, Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Profile } from "./Profile";
import { Image } from "./Image";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Reaction } from "./Reaction";
import { User_Follower } from "./User_Follower";



export enum Gender{
  MALE="Male",
  FEMALE="Female",
}

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name:string;

  @Column()
  surname:string;

  @Column()
  password:string;

  @Column()
  email:string;

  @Column()
  dateOfBirth:string;

  @Column({
    type:"enum",
    enum:Gender,
    default:Gender.MALE
  })
  gender:Gender

  @Column()
  joinedDate:string;


  async validatePassword(password,hash):Promise<Boolean>{
      const isMatch = await bcrypt.compare(password,hash);
      return isMatch;
  }


  //------------- User - Profile ----------------------//
  @OneToOne(
    ()=>Profile, profile=>profile.profileOfUser, {onDelete:'CASCADE'})

  @JoinColumn()
  userHasProfile:Profile;

  // //------------- User - Image --------------------//
  // @OneToMany(
  //   ()=>Image , image=>image.imageOfUser
  // )
  // userHasImage:Image[]

  //-------------- User - Post ---------------------//
  @OneToMany(
    ()=>Post , post=>post.postFromUser, {onDelete:'CASCADE'}
  )
  userHasPost:Post[];

  //-------------- User - Comment -------------------//
  @OneToMany(
    ()=>Comment , comment=>comment.commentOfUser, {onDelete:'CASCADE'}
  )
  userHasComment:Comment[];

  //-------------- User - Reaction -----------------//
  @OneToMany(
    ()=>Reaction, reaction=>reaction.reactionFromUser, {onDelete:'CASCADE'}
  )
  userHasReaction:Reaction[];

  //-------------- User - User_Follower ------------//
  @OneToMany(
    ()=>User_Follower, user_follower=>user_follower.userFollowing, {onDelete:'CASCADE'}
  )
  following:User_Follower[];

  @OneToMany(
    () =>User_Follower, user_follower=>user_follower.userFollowed, {onDelete:'CASCADE'}
  )
  followed:User_Follower[];

}
 