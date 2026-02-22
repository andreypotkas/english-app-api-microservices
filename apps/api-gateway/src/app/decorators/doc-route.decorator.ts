import { Get, Post, Put, Patch, Delete, applyDecorators, SetMetadata, UseGuards, ExecutionContext, CanActivate } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccessType, UserRole } from '@english-app-api/shared-contracts';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const roles = Reflect.getMetadata(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }
    return roles.some((role) => user.role === role);
  }
}

function withGuards(accessType?: AccessType) {
  if (accessType === AccessType.Public) {
    return [SetMetadata(IS_PUBLIC_KEY, true)];
  }
  if (!accessType || accessType === AccessType.User) {
    return [UseGuards(AuthGuard('jwt'))];
  }
  return [UseGuards(AuthGuard('jwt'), RolesGuard), Roles(UserRole.Admin)];
}

export function DocGet(
  path: string | undefined,
  type?: new (...args: unknown[]) => unknown,
  accessType?: AccessType,
) {
  const decorators = [
    path !== undefined ? Get(path) : Get(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
    ...withGuards(accessType),
  ];
  return applyDecorators(...decorators);
}

export function DocPost(
  path: string | undefined,
  type?: new (...args: unknown[]) => unknown,
  accessType?: AccessType,
) {
  const decorators = [
    path !== undefined ? Post(path) : Post(),
    ApiResponse({
      status: 201,
      ...(type && { type }),
    }),
    ...withGuards(accessType),
  ];
  return applyDecorators(...decorators);
}

export function DocPut(
  path: string | undefined,
  type?: new (...args: unknown[]) => unknown,
  accessType?: AccessType,
) {
  const decorators = [
    path !== undefined ? Put(path) : Put(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
    ...withGuards(accessType),
  ];
  return applyDecorators(...decorators);
}

export function DocPatch(
  path: string | undefined,
  type?: new (...args: unknown[]) => unknown,
  accessType?: AccessType,
) {
  const decorators = [
    path !== undefined ? Patch(path) : Patch(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
    ...withGuards(accessType),
  ];
  return applyDecorators(...decorators);
}

export function DocDelete(
  path: string | undefined,
  type?: new (...args: unknown[]) => unknown,
  accessType?: AccessType,
) {
  const decorators = [
    path !== undefined ? Delete(path) : Delete(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
    ...withGuards(accessType),
  ];
  return applyDecorators(...decorators);
}
