import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserPlan } from '@english-app-api/shared-contracts';
import { PLANS_KEY } from '../../decorators/plans.decorator';

@Injectable()
export class PlansGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPlans = this.reflector.getAllAndOverride<UserPlan[]>(PLANS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPlans?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.plan) {
      throw new ForbiddenException('Доступ запрещён');
    }
    const hasPlan = requiredPlans.includes(user.plan);
    if (!hasPlan) {
      throw new ForbiddenException('Требуется премиум-подписка');
    }
    return true;
  }
}
