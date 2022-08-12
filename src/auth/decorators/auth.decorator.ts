import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../interfaces/roles';
import { RoleUser } from './role-user.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleUser(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
