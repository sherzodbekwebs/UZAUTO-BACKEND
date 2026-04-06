import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar yo'lakda (route) hech qanday rol talab qilinmagan bo'lsa, o'tkazib yuboraveramiz
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Foydalanuvchi roli ruxsat berilganlar ichida borligini tekshiramiz
    const hasRole = requiredRoles.some((role) => user.role?.toLowerCase() === role.toLowerCase());

    if (!hasRole) {
      throw new ForbiddenException('Sizda ushbu amalni bajarish uchun huquq yoʻq!');
    }

    return true;
  }
}