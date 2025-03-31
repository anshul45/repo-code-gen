import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleAuthDto, GoogleUserDto } from './dto/google-auth.dto';
import { Auth, google } from 'googleapis';

@Injectable()
export class AuthService {
  private oauth2Client: Auth.OAuth2Client;
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('AUTH_GOOGLE_ID'),
      this.configService.get<string>('AUTH_GOOGLE_SECRET'),
      this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  async googleSignIn(idToken: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('AUTH_GOOGLE_ID'),
      });

      const payload = ticket.getPayload();
      const { email, sub: googleId, given_name, family_name, picture } = payload;

      // Check if user exists
      let user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user
        user = await this.prismaService.user.create({
          data: {
            email,
            googleId,
            firstName: given_name ?? '',
            lastName: family_name ?? '',
            avatarUrl: picture,
          },
        });
      }

      // Generate JWT token
      const jwtPayload = {
        sub: user.id,
        email: user.email,
        googleId: user.googleId,
      };

      const token = await this.jwtService.signAsync(jwtPayload);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      };
    } catch (error) {
      this.logger.error('Google sign in error:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async validateUser(payload: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
