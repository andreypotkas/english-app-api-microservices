import { Controller, Body, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ACCOUNT, AccessType } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { DocPost } from '../decorators/doc-route.decorator';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

@ApiTag('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy) {}

  @DocPost('register', AuthResponseDto, AccessType.Public)
  async register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    const res = await firstValueFrom(this.accountClient.send(ACCOUNT.REGISTER, body));

    if (res.error) {
      throw new BadRequestException(res.error);
    }
    return { accessToken: res.accessToken };
  }

  @DocPost('login', AuthResponseDto, AccessType.Public)
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    const res = await firstValueFrom(this.accountClient.send(ACCOUNT.LOGIN, body));
    if (res.error) {
      throw new BadRequestException(res.error);
    }
    return { accessToken: res.accessToken };
  }
}
