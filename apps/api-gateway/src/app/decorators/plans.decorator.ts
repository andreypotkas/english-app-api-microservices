import { SetMetadata } from '@nestjs/common';
import type { UserPlan } from '@english-app-api/shared-contracts';

export const PLANS_KEY = 'plans';

/** Требуемый план: free | premium. */
export const Plans = (...plans: UserPlan[]) => SetMetadata(PLANS_KEY, plans);
