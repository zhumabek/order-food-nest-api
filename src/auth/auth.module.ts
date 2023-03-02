import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

export const JWT_CONFIG: JwtModuleOptions = {
  secret: 'supersecretkey',
  signOptions: {
    expiresIn: '30m',
  },
};
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(JWT_CONFIG),
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}
