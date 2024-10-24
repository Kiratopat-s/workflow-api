import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const userId = '1';
    const mockUser = {
        id: 1,
        username: 'test',
        password: 'test',
        description: '',
        role: Role.USER,
        items: [],
        approvedItems: []
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        upgradeRole: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
                username: 'test',
                password: 'test',
                description: ''
            };

            jest.spyOn(service, 'create').mockResolvedValue(mockUser);

            expect(await controller.create(createUserDto)).toBe(mockUser);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const mockUsers = [mockUser];
            jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

            expect(await controller.findAll()).toBe(mockUsers);
        });
    });

    describe('findOne', () => {
        it('should return a single user', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

            expect(await controller.findOne(userId)).toBe(mockUser);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { username: 'test2' };
            jest.spyOn(service, 'update').mockResolvedValue(mockUser);

            expect(await controller.update(userId, updateUserDto)).toBe(mockUser);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const expectedResult = { message: `User with ID ${userId} deleted` };

            jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

            expect(await controller.remove(userId)).toBe(expectedResult);
        });
    });

    describe('upgradeRole', () => {
        it('should upgrade the role of a user', async () => {
            jest.spyOn(service, 'upgradeRole').mockResolvedValue(mockUser);

            expect(await controller.upgradeRole(1, Role.ADMIN)).toBe(mockUser);
        });

        it('should throw NotFoundException for invalid role', async () => {
            jest.spyOn(service, 'upgradeRole').mockRejectedValue(new NotFoundException('Role INVALID_ROLE not found'));

            await expect(controller.upgradeRole(1, 'INVALID_ROLE' as Role)).rejects.toThrow(NotFoundException);
            await expect(controller.upgradeRole(1, 'INVALID_ROLE' as Role)).rejects.toThrow('Role INVALID_ROLE not found');
        });
    });
});