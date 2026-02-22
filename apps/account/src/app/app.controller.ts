import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { ACCOUNT, PROFILE } from '@english-app-api/shared-contracts';
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  AuthErrorResponse,
  GetProfilePayload,
  UpdateProfilePayload,
} from '@english-app-api/shared-contracts';
import { Profile } from 'apps/account/src/app/entities/profile.entity';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(ACCOUNT.REGISTER)
  async register(payload: RegisterPayload): Promise<AuthResponse | AuthErrorResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern(ACCOUNT.LOGIN)
  async login(payload: LoginPayload): Promise<AuthResponse | AuthErrorResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern(PROFILE.GET)
  async getProfile(payload: GetProfilePayload): Promise<Profile> {
    const userId = typeof payload.userId === 'string' ? parseInt(payload.userId, 10) : payload.userId;
    return this.authService.getProfile(userId);
  }

  @MessagePattern(PROFILE.UPDATE)
  async updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
    const userId = typeof payload.userId === 'string' ? parseInt(payload.userId, 10) : payload.userId;
    return this.authService.updateProfile(userId, {
      name: payload.name,
      avatarUrl: payload.avatarUrl,
    });
  }
}
