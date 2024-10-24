import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggedInDto } from './dto/logged-in.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let configService: ConfigService;

    const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        description: 'Test User',
        role: Role.USER,
        items: [],
        approvedItems: []
    };

    const mockLoggedInDto: LoggedInDto = {
        id: 1,
        username: 'testuser',
        role: Role.USER,
        description: 'Test User',
        items: [],
        approvedItems: []
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOneByUsername: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        decode: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);

        // jest.mock('uuid', () => ({
        //     v4: jest.fn().mockReturnValue('0192bc68-8e31-7ddb-9acf-91cc6d85df9e'),
        // }));
    });

    describe('validateUser', () => {
        it('should return user without password if validation is successful', async () => {
            jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await service.validateUser('testuser', 'password');
            expect(result).toEqual(mockLoggedInDto);
        });

        it('should return null if user is not found', async () => {
            jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

            const result = await service.validateUser('testuser', 'password');
            expect(result).toBeNull();
        });

        it('should return null if password is incorrect', async () => {
            jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const result = await service.validateUser('testuser', 'password');
            expect(result).toBeNull();
        });
    });

    describe('validateUserByAccessToken', () => {
        it('should return user without password if access token is valid', async () => {
            const mockAccessToken = 'mockAccessToken';
            const mockDecodedToken = { preferred_username: 'testuser' };

            jest.spyOn(jwtService, 'decode').mockReturnValue(mockDecodedToken);
            jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);

            const result = await service.validateUserByAccessToken(mockAccessToken);
            expect(result).toEqual(mockLoggedInDto);
        });

        it('should return null if user is not found', async () => {
            const mockAccessToken = 'mockAccessToken';
            const mockDecodedToken = { preferred_username: 'testuser' };

            jest.spyOn(jwtService, 'decode').mockReturnValue(mockDecodedToken);
            jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

            const result = await service.validateUserByAccessToken(mockAccessToken);
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access and refresh tokens', () => {
            const mockAccessToken = 'mockAccessToken';
            const mockRefreshToken = 'mockRefreshToken';

            jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockAccessToken).mockReturnValueOnce(mockRefreshToken);
            jest.spyOn(configService, 'get').mockReturnValueOnce('refreshSecret').mockReturnValueOnce('1d');

            const result = service.login(mockLoggedInDto);
            expect(result).toEqual({ access_token: mockAccessToken, refresh_token: mockRefreshToken });
        });
    });

    describe('refreshToken', () => {
        it('should return a new access token', () => {
            const mockAccessToken = 'mockAccessToken';

            jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);

            const result = service.refreshToken(mockLoggedInDto);
            expect(result).toEqual({ access_token: mockAccessToken });
        });
    });

    describe('getOauth2RedirectUrl', () => {
        it('should return the OAuth2 redirect URL', () => {
            const mockAuthUrl = 'http://example.com/oauth2/authorize';
            const mockClientId = 'clientId';
            const mockRedirectUri = 'http://example.com/oauth2/callback';
            const mockScope = 'openid profile';
            const mockResponseType = 'code';
            const mockState = '0192bc68-8e31-7ddb-9acf-91cc6d85df9e';

            jest.spyOn(configService, 'get')
                .mockReturnValueOnce(mockAuthUrl)
                .mockReturnValueOnce(mockClientId)
                .mockReturnValueOnce(mockRedirectUri)
                .mockReturnValueOnce(mockScope)
                .mockReturnValueOnce(mockResponseType);

            const result = service.getOauth2RedirectUrl();
            const expectedUrlPattern = new RegExp(`^${mockAuthUrl}\\?client_id=${mockClientId}&redirect_uri=${mockRedirectUri}&scope=${encodeURIComponent(mockScope)}&response_type=${mockResponseType}&state=[0-9a-fA-F-]{36}$`);
            expect(result).toMatch(expectedUrlPattern);
        });
    });
});