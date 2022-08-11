import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
}
