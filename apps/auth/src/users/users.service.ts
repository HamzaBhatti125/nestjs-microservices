import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    console.log('this is user...', createUserDto);
    await this.validateCreateUserDto(createUserDto);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashedPassword };
    return this.userRepository.create(user);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch {
      return;
    }

    throw new UnprocessableEntityException(
      'User with this email already exists',
    );
  }

  async verifyUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async getUser(getUserDto: GetUserDto) {
    try {
      const user = await this.userRepository.findOne(getUserDto);
      return user;
    } catch (error) {
      console.error('Error finding user:', error.message);
      throw error;
    }
  }

  async findAll() {
    return this.userRepository.find({});
  }
}
