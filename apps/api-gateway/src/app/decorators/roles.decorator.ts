import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@english-app-api/shared-contracts';

export const ROLES_KEY = 'roles';

/** Требуемая роль: user | admin. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
