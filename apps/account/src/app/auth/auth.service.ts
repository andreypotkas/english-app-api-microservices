import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import type {
  UserResponse,
  UserRole,
  UserPlan,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  AuthErrorResponse,
  ProfileResponse,
} from '@english-app-api/shared-contracts';

const SALT_ROUNDS = 10;

function toUserResponse(account: Account): UserResponse {
  return {
    id: account.id,
    email: account.email,
    role: account.role as UserRole,
    plan: account.plan as UserPlan,
    createdAt: account.created_at.toISOString(),
  };
}

function toProfileResponse(profile: Profile): ProfileResponse {
  return {
    userId: profile.account_id,
    displayName: profile.display_name ?? `User ${profile.account_id}`,
    avatarUrl: profile.avatar_url ?? undefined,
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterPayload): Promise<AuthResponse | AuthErrorResponse> {
    const existing = await this.accountRepository.findOne({
      where: { email: payload.email.toLowerCase() },
    });
    if (existing) {
      return {
        error: 'User with this email already exists',
        statusCode: 409,
      };
    }

    const role = payload.role ?? 'user';
    const plan = payload.plan ?? 'free';
    if (role === 'admin') {
      return {
        error: 'Cannot register as admin via this endpoint',
        statusCode: 400,
      };
    }

    const password_hash = bcrypt.hashSync(payload.password, SALT_ROUNDS);
    const account = this.accountRepository.create({
      email: payload.email.toLowerCase(),
      password_hash,
      role,
      plan,
    });
    const savedAccount = await this.accountRepository.save(account);

    const profile = this.profileRepository.create({
      account_id: savedAccount.id,
    });
    await this.profileRepository.save(profile);

    const accessToken = this.jwtService.sign({
      sub: savedAccount.id,
      email: savedAccount.email,
      role: savedAccount.role,
    });
    return {
      user: toUserResponse(savedAccount),
      accessToken,
    };
  }

  async login(payload: LoginPayload): Promise<AuthResponse | AuthErrorResponse> {
    const account = await this.accountRepository.findOne({
      where: { email: payload.email.toLowerCase() },
    });
    if (!account) {
      return {
        error: 'Invalid email or password',
        statusCode: 401,
      };
    }
    const match = bcrypt.compareSync(payload.password, account.password_hash);
    if (!match) {
      return {
        error: 'Invalid email or password',
        statusCode: 401,
      };
    }
    const accessToken = this.jwtService.sign({
      sub: account.id,
      email: account.email,
      role: account.role,
    });
    return {
      user: toUserResponse(account),
      accessToken,
    };
  }

  async getUser(userId: string): Promise<UserResponse | null> {
    const account = await this.accountRepository.findOne({ where: { id: userId } });
    return account ? toUserResponse(account) : null;
  }

  async getProfile(userId: string): Promise<ProfileResponse | null> {
    const profile = await this.profileRepository.findOne({
      where: { account_id: userId },
    });
    return profile ? toProfileResponse(profile) : null;
  }

  async updateProfile(
    userId: string,
    data: { displayName?: string; avatarUrl?: string },
  ): Promise<ProfileResponse | null> {
    const profile = await this.profileRepository.findOne({
      where: { account_id: userId },
    });
    if (!profile) return null;
    if (data.displayName !== undefined) profile.display_name = data.displayName;
    if (data.avatarUrl !== undefined) profile.avatar_url = data.avatarUrl;
    await this.profileRepository.save(profile);
    return toProfileResponse(profile);
  }
}
