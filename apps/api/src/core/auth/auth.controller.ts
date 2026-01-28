import { Controller, Post, Body, Res, Req, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

class LoginDto { @IsEmail() email: string; @IsString() @MinLength(6) password: string; @IsString() @IsOptional() tenantSlug?: string; }
class RefreshDto { @IsString() refreshToken: string; }

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Post('login') @HttpCode(200) @ApiOperation({ summary: 'Login' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.auth.login(dto.email, dto.password);
    res.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    return tokens;
  }

  @Public() @Post('refresh') @HttpCode(200) @ApiOperation({ summary: 'Refresh tokens' })
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.refresh(dto.refreshToken || (req.cookies?.refresh_token as string));
  }

  @Post('logout') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.cookies?.refresh_token) await this.auth.logout(req.cookies.refresh_token);
    res.clearCookie('access_token'); res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  @Get('profile') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @ApiOperation({ summary: 'Get profile' })
  profile(@CurrentUser() user: any) { return this.auth.getProfile(user.id); }
}