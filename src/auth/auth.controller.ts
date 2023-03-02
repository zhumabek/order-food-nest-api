import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LogInDto, RegisterDto } from './auth.dto';
import { LogInResponse } from './auth.types';
import { AppResponse } from '../app.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  logIn(@Body() data: LogInDto): Promise<AppResponse<LogInResponse>> {
    return this.authService.logIn(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: RegisterDto): Promise<AppResponse<LogInResponse>> {
    return this.authService.register(data);
  }
}
