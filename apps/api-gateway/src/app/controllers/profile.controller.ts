import { Controller, Get, Put, Body, Inject, HttpException } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PROFILE, AccessType } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/jwt.strategy';
import { DocGet, DocPut } from '../decorators/doc-route.decorator';
import { User } from 'apps/api-gateway/src/decorators/user.decorator';
import { Profile } from '@english-app-api/entities';

@ApiTag('profile')
@ApiBearerAuth('JWT')
@Controller('profile')
export class ProfileController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy) {}

  @DocGet('me', Profile, AccessType.User)
  async me(@User() user: JwtPayload): Promise<Profile> {
    const result = await firstValueFrom(this.accountClient.send(PROFILE.GET, { userId: user.sub }));
    if (result == null) {
      throw new HttpException('User or profile not found', 404);
    }
    return result;
  }

  @DocPut('me', Profile, AccessType.User)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        avatarUrl: { type: 'string' },
      },
    },
  })
  async updateProfile(@User() user: JwtPayload, @Body() body: { name?: string; avatarUrl?: string }): Promise<Profile> {
    const profile = await firstValueFrom(this.accountClient.send(PROFILE.UPDATE, { userId: user.sub, ...body }));
    if (profile == null) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }
}
