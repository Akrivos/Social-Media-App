import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class User_Follower extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    //------------User-Following-----------//
    @ManyToOne(
        ()=>User, user=>user.following, {onDelete:'CASCADE'}
    )
    userFollowing: User;

    //-----------User- User_Follower--------------//
    @ManyToOne(
        ()=>User, user=>user.followed, {onDelete:'CASCADE'}
    )
    userFollowed: User;
}