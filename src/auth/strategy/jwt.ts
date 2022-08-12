import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    config: ConfigService,
  ) {
    super({
      secretOrKey: config.getOrThrow('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }

    if (!user.active) {
      throw new UnauthorizedException('Invalid User');
    }

    return user;
  }
}
