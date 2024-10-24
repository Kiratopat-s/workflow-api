import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Role, User } from '../users/entities/user.entity';
import { Item, ItemStatus } from './entities/item.entity';
import { BadRequestException } from '@nestjs/common';

describe('ItemsController', () => {
    let controller: ItemsController;
    let service: ItemsService;

    // const mockUser = {
    //     id: 1,
    //     username: 'testuser',
    //     description: 'test description',
    //     role: Role.USER,
    //     sub: 1,
    //     iat: 0,
    //     exp: 0,
    // };

    // const mockItem = {
    //     id: 2,
    //     title: "Desktop Tower",
    //     amount: 7000,
    //     quantity: 2,
    //     status: ItemStatus.PENDING,
    //     owner_id: 2,
    //     approver_id: 1,
    //     created_at: "2024-10-22T04:00:34.535Z",
    //     updated_status_at: "2024-10-22T04:00:34.535Z",
    //     owner: {
    //         id: 2,
    //         username: "u1002"
    //     },
    //     approver: {
    //         id: 1,
    //         username: "u1001"
    //     }
    // }

    // Mock data
    const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        description: 'Test User',
        role: Role.USER,
        items: [],
        approvedItems: []
    };

    const mockItem: Item = {
        id: 1,
        title: 'Test Item',
        amount: 100,
        quantity: 1,
        status: ItemStatus.PENDING,
        owner_id: 1,
        approver_id: 2,
        created_at: new Date(),
        updated_status_at: new Date(),
        owner: mockUser,
        approver: {
            id: 2,
            username: 'approveruser',
            password: 'password',
            description: 'Approver User',
            role: Role.ADMIN,
            items: [],
            approvedItems: []
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ItemsController],
            providers: [
                {
                    provide: ItemsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        approve: jest.fn(),
                        reject: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ItemsController>(ItemsController);
        service = module.get<ItemsService>(ItemsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new item', async () => {
            const createItemDto: CreateItemDto = {
                title: 'Test Item',
                quantity: 1,
                amount: 100,
            };

            const request = { user: mockUser } as any;

            jest.spyOn(service, 'create').mockResolvedValue(mockItem);

            expect(await controller.create(createItemDto, request)).toBe(mockItem);
        });
    });

    describe('findAll', () => {
        it('should return an array of items', async () => {
            const result = [mockItem];
            jest.spyOn(service, 'findAll').mockResolvedValue(result);

            expect(await controller.findAll()).toBe(result);
        });
    });

    describe('findAll', () => {
        it('should return an array of items', async () => {
            const result = [mockItem];
            jest.spyOn(service, 'findAll').mockResolvedValue(result);

            expect(await controller.findAll()).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single item', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockItem);

            expect(await controller.findOne(1)).toBe(mockItem);
        });
    });

    describe('update', () => {
        it('should update an item', async () => {
            const updateItemDto: UpdateItemDto = {
                title: "Mechanical Keyboard edited hi",
                amount: 45000,
                quantity: 6,
            };
            jest.spyOn(service, 'update').mockResolvedValue(mockItem);

            expect(await controller.update('1', updateItemDto)).toBe(mockItem);
        });
    });

    describe('remove', () => {
        it('should remove an item', async () => {
            const result = { raw: 1, affected: 1 };
            jest.spyOn(service, 'remove').mockResolvedValue(result);

            expect(await controller.remove('1')).toEqual({ message: 'id 1 deleted' });
        });

        it('should throw BadRequestException if item not found', async () => {
            const result = { raw: 1, affected: 0 };
            jest.spyOn(service, 'remove').mockResolvedValue(result);

            await expect(controller.remove('1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('approve', () => {
        it('should approve an item', async () => {
            jest.spyOn(service, 'approve').mockResolvedValue(mockItem);

            const request = { user: mockUser } as any;

            expect(await controller.approve(1, request)).toBe(mockItem);
        });
    });

    describe('reject', () => {
        it('should reject an item', async () => {
            jest.spyOn(service, 'reject').mockResolvedValue(mockItem);

            const request = { user: mockUser } as any;

            expect(await controller.reject(1, request)).toBe(mockItem);
        });
    });
});