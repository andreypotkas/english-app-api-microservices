import { Controller, Get, Put, Body, Inject, HttpException, Req } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PROFILE } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/jwt.strategy';
import { DocGet, DocPut } from '../decorators/doc-route.decorator';

@ApiTag('profile')
@ApiBearerAuth('JWT')
@Controller('profile')
export class ProfileController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy) {}

  @DocGet('me', undefined)
  async me(@Req() req: { user?: JwtPayload }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    const result = await firstValueFrom(this.accountClient.send(PROFILE.GET, { userId }));
    if (result == null) {
      throw new HttpException('User or profile not found', 404);
    }
    return result;
  }

  @DocPut('me', undefined)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        avatarUrl: { type: 'string' },
      },
    },
  })
  async updateProfile(@Req() req: { user?: JwtPayload }, @Body() body: { name?: string; avatarUrl?: string }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    const profile = await firstValueFrom(this.accountClient.send(PROFILE.UPDATE, { userId, ...body }));
    if (profile == null) {
      throw new HttpException('Profile not found', 404);
    }
    return profile;
  }
}
