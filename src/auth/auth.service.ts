import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LogInResponse } from './auth.types';
import { LogInDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRoles } from '../schemas';
import { Model } from 'mongoose';
import { AppResponse, LoginJwtPayload } from '../app.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async logIn({
    email,
    password,
  }: LogInDto): Promise<AppResponse<LogInResponse>> {
    try {
      const errorMessage = 'Incorrect email or password.';
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new HttpException(
          { message: errorMessage },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new HttpException(
          { message: errorMessage },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtToken = await this.generateJwtToken(user);

      user.password = null;

      return {
        data: { user, token: jwtToken },
      };
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async register(data: RegisterDto): Promise<AppResponse<LogInResponse>> {
    try {
      const { email, name, password, role } = data;

      const user = await this.userModel.findOne({ email });

      if (user) {
        throw new HttpException(
          'A user with this email address already exists.',
          HttpStatus.FORBIDDEN,
        );
      }

      const newUser = new this.userModel({
        email,
        name,
        role,
        password: await this.hashedPassword(password),
      });

      await newUser.save();

      const jwtToken = await this.generateJwtToken(newUser);
      newUser.password = null;

      return {
        data: {
          user: newUser,
          token: jwtToken,
        },
      };
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  generateJwtToken(user: UserDocument): Promise<string> {
    return this.jwtService.signAsync({
      id: user.id,
    });
  }

  async authorize(guardRoles: UserRoles[], request: any) {
    try {
      const token = request.headers['authorization'];

      if (!token) {
        throw new UnauthorizedException('Token is not provided!');
      }

      const payload: LoginJwtPayload = await this.jwtService.verifyAsync(token);
      const user = await this.userModel.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Token is invalid or has expired!');
      }

      if (!guardRoles.includes(user.role)) {
        throw new UnauthorizedException('Forbidden!');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Token is invalid or has expired!',
      );
    }
  }
}
