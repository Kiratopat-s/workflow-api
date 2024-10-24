import { Controller, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoggedInDto } from './dto/logged-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v7 as uuidv7 } from 'uuid';

@Controller('auth')
@Injectable()
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  private async getUserWithoutPassword(username: string): Promise<LoggedInDto | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      this.logger.debug(`User not found: username=${username}`);
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(username: string, password: string): Promise<LoggedInDto | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      this.logger.debug(`User not found: username=${username}`);
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      this.logger.debug(`Wrong password: username=${username}`);
      return null;
    }
  }

  async validateUserByAccessToken(accessToken: string): Promise<LoggedInDto | null> {
    const userInfo: { preferred_username: string } = await this.jwtService.decode(accessToken) as { preferred_username: string };
    return this.getUserWithoutPassword(userInfo.preferred_username);
  }

  private generateToken(payload: LoggedInDto, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  login(loggedInDto: LoggedInDto): { access_token: string; refresh_token: string } {
    const payload: LoggedInDto = { ...loggedInDto, sub: loggedInDto.id };
    const access_token = this.jwtService.sign(payload);

    const refreshTokenSecret = this.configService.get<string>('REFRESH_JWT_SECRET');
    const refreshTokenExpiresIn = this.configService.get<string>('REFRESH_JWT_EXPIRES_IN');
    const refresh_token = this.generateToken(payload, refreshTokenSecret, refreshTokenExpiresIn);

    return { access_token, refresh_token };
  }

  refreshToken(loggedInDto: LoggedInDto): { access_token: string } {
    const payload: LoggedInDto = { ...loggedInDto, sub: loggedInDto.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  getOauth2RedirectUrl(): string {
    const auth_url = this.configService.get<string>('OAUTH2_AUTH_URL');
    const client_id = this.configService.get<string>('OAUTH2_CLIENT_ID');
    const redirect_uri = this.configService.get<string>('OAUTH2_CALLBACK_URL');
    const scope = encodeURIComponent(this.configService.get<string>('OAUTH2_SCOPE'));
    const response_type = this.configService.get<string>('OAUTH2_RESPONSE_TYPE');
    const state = uuidv7();
    return `${auth_url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&state=${state}`;
  }
}