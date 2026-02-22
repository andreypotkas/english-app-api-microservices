import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

/**
 * Кастомный декоратор для Swagger: задаёт тег контроллера (убирает дубли в Swagger UI).
 */
export function ApiTag(tag: string) {
  return applyDecorators(ApiTags(tag));
}
