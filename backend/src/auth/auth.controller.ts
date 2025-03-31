import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/signin')
  @HttpCode(HttpStatus.OK)
  async googleSignIn(@Body() googleAuthDto: GoogleAuthDto) {
    console.log("googleAuthDto", googleAuthDto);
    return this.authService.googleSignIn(googleAuthDto.idToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return {
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatarUrl: req.user.avatarUrl,
      },
    };
  }
}
