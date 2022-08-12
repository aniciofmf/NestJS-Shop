import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/user.decorator';
import { User } from './entities/user.entity';

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

  @Get('checkAuth')
  @Auth()
  checkAuth(@GetUser() user: User) {
    return this.authService.checkAuth(user);
  }
}
