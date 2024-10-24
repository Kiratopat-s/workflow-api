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

  async create(createUserDto: CreateUserDto) {

    // gen salt
    const salt = await bcrypt.genSalt();

    // enc password
    const encPassword = await bcrypt.hash(createUserDto.password, salt)

    // replace password with encPassword
    const userWithEncPassword = { ...createUserDto, password: encPassword };

    // saved
    const savedUser = await this.userRepository.save(userWithEncPassword);

    // spread password filed from savedUser
    const { password, ...userWithoutPassword } = savedUser;

    // return user without password filed
    return userWithoutPassword;

  }

  async upgradeRole(id: number, role: Role) {
    if (!Object.values(Role).includes(role)) {
      throw new NotFoundException(`Role ${role} not found`);
    }
    const result = await this.userRepository.update(id, { role });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    if (!username) {
      return null
    }
    return this.userRepository.findOneBy({ username })
  }


  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserWithoutPassword> {
    let user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // remove password field
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // if password is provided
    if (updateUserDto.password) {
      // gen salt
      const salt = await bcrypt.genSalt();

      // enc password
      const encPassword = await bcrypt.hash(updateUserDto.password, salt);

      // replace password with encPassword
      updateUserDto = { ...updateUserDto, password: encPassword };
    }
    const result = this.userRepository.update(id, updateUserDto);

    if ((await result).affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: number) {

    const result = this.userRepository.delete(id);
    if ((await result).affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} deleted` };
  }
}
