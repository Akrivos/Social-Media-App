import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
    imports:[],
    providers:[CommentService],
    controllers:[CommentController]
})
export class CommentModule{}