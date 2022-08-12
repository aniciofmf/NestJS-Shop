import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interfaces/roles';

export const ROLES = 'roles';

export const RoleUser = (...args: Roles[]) => {
  return SetMetadata(ROLES, args);
};
