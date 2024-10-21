import { Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoggedInDto } from './dto/logged-in.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { PerfLoggerInterceptor } from 'src/interceptors/perf-logger.interceptor';

@UseInterceptors(PerfLoggerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request: { user: LoggedInDto }) {
    const tokens = this.authService.login(request.user)
    // return { access_token };

    // for testing purposes
    const userMetedata = request.user;
    return { tokens, user: userMetedata };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  refreshToken(@Request() request: { user: LoggedInDto }) {
    return this.authService.refreshToken(request.user);
  }
}
