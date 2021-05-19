
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'baklavas28',
        }), PassportModule
    ],
    controllers:[UserController],
    providers:[UserService,JwtStrategy],
    exports:[JwtStrategy,PassportModule]
})
export class UserModule{}