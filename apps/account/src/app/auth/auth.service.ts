import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Account, Profile, UserRole } from '@english-app-api/entities';
import type { RegisterPayload, LoginPayload, AuthResponse, AuthErrorResponse } from '@english-app-api/shared-contracts';

const SALT_ROUNDS = 10;

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

    const password_hash = bcrypt.hashSync(payload.password, SALT_ROUNDS);
    const account = this.accountRepository.create({
      email: payload.email.toLowerCase(),
      password_hash,
      role: UserRole.User,
    });
    const savedAccount = await this.accountRepository.save(account);

    const profile = this.profileRepository.create({
      account_id: savedAccount.id,
      name: payload.name ?? null,
    });
    await this.profileRepository.save(profile);

    const accessToken = this.jwtService.sign({
      sub: String(savedAccount.id),
      email: savedAccount.email,
      role: savedAccount.role,
    });
    return { accessToken };
  }

  async login(payload: LoginPayload): Promise<AuthResponse | AuthErrorResponse> {
    const account = await this.accountRepository.findOne({
      where: { email: payload.email.toLowerCase() },
    });
    if (!account) {
      return { error: 'Invalid email or password', statusCode: 401 };
    }
    const match = bcrypt.compareSync(payload.password, account.password_hash);
    if (!match) {
      return { error: 'Invalid email or password', statusCode: 401 };
    }
    const accessToken = this.jwtService.sign({
      sub: String(account.id),
      email: account.email,
      role: account.role,
    });
    return { accessToken };
  }

  async getProfile(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { account_id: id },
      relations: { account: true },
    });
    console.log(profile);

    return profile;
  }

  async updateProfile(id: number, data: { name?: string; avatarUrl?: string }): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { account_id: id },
    });
    if (data.name !== undefined) profile.name = data.name;
    if (data.avatarUrl !== undefined) profile.avatar_url = data.avatarUrl;
    return this.profileRepository.save(profile);
  }
}
