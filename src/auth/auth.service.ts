import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...restOfData } = createUserDto;

      const user = await this.userRepository.create({
        ...restOfData,
        password: bcrypt.hashSync(password, 10),
      });

      const { email, fullname, roles } = await this.userRepository.save(user);

      return {
        email,
        fullname,
        roles,
      };
    } catch (error) {}
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid Credentials');

    return {
      ...user,
    };
  }
}
