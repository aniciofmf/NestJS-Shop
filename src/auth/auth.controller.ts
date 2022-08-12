import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() creaUserDto: CreateUserDto) {
    return this.authService.register(creaUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
