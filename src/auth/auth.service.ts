import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...restOfData } = createUserDto;

      const user = await this.userRepository.create({
        ...restOfData,
        password: bcrypt.hashSync(
          password,
          parseInt(this.configService.get('CRYPTO_ROUNDS')),
        ),
      });

      const { id, email, fullname, roles } = await this.userRepository.save(
        user,
      );

      return {
        email,
        fullname,
        roles,
        token: this.generateJwtToken({ id, email }),
      };
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
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
      token: this.generateJwtToken({ id: user.id, email: user.email }),
    };
  }

  private generateJwtToken(payload: JwtPayload) {
    const jwtToken = this.jwtService.sign(payload);

    return jwtToken;
  }
}
