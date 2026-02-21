import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ACCOUNT, PROFILE } from '@english-app-api/shared-contracts';
import type {
  GetUserPayload,
  UserResponse,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  AuthErrorResponse,
  GetProfilePayload,
  UpdateProfilePayload,
  ProfileResponse,
} from '@english-app-api/shared-contracts';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern(ACCOUNT.GET_USER)
  async getUser(payload: GetUserPayload): Promise<UserResponse | null> {
    return this.authService.getUser(payload.userId);
  }

  @MessagePattern(ACCOUNT.REGISTER)
  async register(
    payload: RegisterPayload,
  ): Promise<AuthResponse | AuthErrorResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern(ACCOUNT.LOGIN)
  async login(
    payload: LoginPayload,
  ): Promise<AuthResponse | AuthErrorResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern(PROFILE.GET)
  async getProfile(payload: GetProfilePayload): Promise<ProfileResponse | null> {
    return this.authService.getProfile(payload.userId);
  }

  @MessagePattern(PROFILE.UPDATE)
  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse | null> {
    return this.authService.updateProfile(payload.userId, {
      displayName: payload.displayName,
      avatarUrl: payload.avatarUrl,
    });
  }
}
