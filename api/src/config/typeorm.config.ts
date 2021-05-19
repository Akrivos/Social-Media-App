import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Comment } from "src/entities/Comment";
import { Post } from "src/entities/Post";
import { Profile } from "src/entities/Profile";
import { Reaction } from "src/entities/Reaction";
import { User } from "src/entities/User";
import { User_Follower } from "src/entities/User_Follower";

export default class TypeOrmConfig{
    static getOrmConfig(configService:ConfigService): TypeOrmModuleOptions{
        return {
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities:[User,Profile,Post,Comment,Reaction,User_Follower],
            synchronize: true
        };
    }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    imports:[ConfigModule],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
    inject:[ConfigService]
}