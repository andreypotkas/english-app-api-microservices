import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Эндпоинт доступен без JWT (например, login, register). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
