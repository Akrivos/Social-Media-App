import { Module} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { profile } from 'console';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { Comment } from './entities/Comment';
import { Post } from './entities/Post';
import { Profile } from './entities/Profile';
import { Reaction } from './entities/Reaction';
import { User } from './entities/User';
import { User_Follower } from './entities/User_Follower';
import { FollowerModule } from './follower/follower.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { ReactionModule } from './reaction/reaction.module';
import { UserModule } from './user/user.module';


@Module({

    imports: [
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: '...',
        port: 0,
        username: '...',
        password: '...',
        database: '...',
        entities:[User,Profile,Post,Comment,Reaction,User_Follower],
        synchronize: true
      }),UserModule,ProfileModule,PostModule,CommentModule,ReactionModule,FollowerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
