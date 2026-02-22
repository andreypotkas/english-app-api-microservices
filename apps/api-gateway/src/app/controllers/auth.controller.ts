import { Controller, Post, Body, Inject, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { ACCOUNT } from '@english-app-api/shared-contracts';
import { ApiTag } from '../decorators/api-endpoint.decorator';
import { DocPost } from '../decorators/doc-route.decorator';
import { Public } from '../decorators/public.decorator';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

function mapRpcErrorToHttp(err: unknown): never {
  const payload =
    typeof (err as { getError?: () => unknown })?.getError === 'function'
      ? (err as { getError: () => unknown }).getError()
      : ((err as { response?: unknown })?.response ?? err);
  const message =
    typeof payload === 'object' && payload !== null && 'error' in payload && typeof (payload as { error: unknown }).error === 'string'
      ? (payload as { error: string }).error
      : 'Internal error';
  const statusCode =
    typeof payload === 'object' && payload !== null && 'statusCode' in payload && typeof (payload as { statusCode: unknown }).statusCode === 'number'
      ? (payload as { statusCode: number }).statusCode
      : 500;
  throw new HttpException(message, statusCode);
}

/** RabbitMQ может вернуть RpcException как успешный ответ с полями error + statusCode */
function ensureAuthSuccess(res: unknown): res is { accessToken: string } {
  if (typeof res === 'object' && res !== null && 'error' in res && 'statusCode' in res) {
    const { error, statusCode } = res as { error: string; statusCode: number };
    throw new HttpException(error, statusCode);
  }
  return typeof res === 'object' && res !== null && 'accessToken' in res && typeof (res as { accessToken: unknown }).accessToken === 'string';
}

@ApiTag('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy) {}

  @Public()
  @DocPost('register', AuthResponseDto)
  async register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    const res = await firstValueFrom(this.accountClient.send(ACCOUNT.REGISTER, body).pipe(catchError(mapRpcErrorToHttp)));
    if (!ensureAuthSuccess(res)) {
      throw new HttpException('Invalid response from auth service', 502);
    }
    return { accessToken: res.accessToken };
  }

  @Public()
  @DocPost('login', AuthResponseDto)
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    const res = await firstValueFrom(
      this.accountClient
        .send(ACCOUNT.LOGIN, {
          email: body.email,
          password: body.password,
        })
        .pipe(catchError(mapRpcErrorToHttp)),
    );
    if (!ensureAuthSuccess(res)) {
      throw new HttpException('Invalid response from auth service', 502);
    }
    return { accessToken: res.accessToken };
  }
}
