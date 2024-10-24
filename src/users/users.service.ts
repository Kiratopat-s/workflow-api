import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }

  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const encPassword = await this.encryptPassword(createUserDto.password);
    const userWithEncPassword = { ...createUserDto, password: encPassword };
    const savedUser = await this.userRepository.save(userWithEncPassword);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async upgradeRole(id: number, role: Role): Promise<UserWithoutPassword> {
    if (!Object.values(Role).includes(role)) {
      throw new NotFoundException(`Role ${role} not found`);
    }
    const result = await this.userRepository.update(id, { role });
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    if (!username) {
      return null;
    }
    return this.userRepository.findOneBy({ username });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.encryptPassword(updateUserDto.password);
    }
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} deleted` };
  }
}