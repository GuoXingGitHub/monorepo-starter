import * as express from 'express';
import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { HttpUnauthorizedError } from '../errors/unauthorized.error';
import { TokenService } from '../providers/token.service';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const AllowAnonymous = () => SetMetadata('allowAnonymous', true);
export const Authenticated = () => SetMetadata('roles', []);
export const RoleAdmin = () => SetMetadata('roles', ['ADMIN']);

const reflectValue = <T>(
  reflector: Reflector,
  key: string,
  context: ExecutionContext,
  defaultValue: T,
) => {
  const methodValue = reflector.get<T>(key, context.getHandler());

  if (methodValue !== undefined) {
    return methodValue;
  }

  const classValue = reflector.get<T>(key, context.getClass());

  if (classValue !== undefined) {
    return classValue;
  }

  return defaultValue;
};

function isAllowAnonymous(
  reflector: Reflector,
  context: ExecutionContext,
): boolean {
  return reflectValue(reflector, 'allowAnonymous', context, false);
}

// TODO: Change type to FirebaseTokenPayload
function isUserAllowedAccess(
  reflector: Reflector,
  context: ExecutionContext,
  payload?: any,
): boolean {
  if (!payload) {
    return false;
  }

  const roles = reflectValue(reflector, 'roles', context, []);
  if (!roles.length) {
    return true;
  }

  const { roles: userRoles = [] } = payload;
  const allowed = roles.some(role => userRoles.includes(role));
  if (!allowed) {
    Logger.warn('User does not have the required role');
  }

  return allowed;
}

/**
 * @class JwtAuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('firebase') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    if (isAllowAnonymous(this.reflector, context)) {
      return true;
    }
    try {
      super.canActivate(context);

      const { headers } = context.switchToHttp().getRequest<express.Request>();
      const token = TokenService.getTokenFromHeader(headers);

      if (!token) return false;

      // TODO: Change type to FirebaseTokenPayload
      const payload = TokenService.decode(token) as any;
      return isUserAllowedAccess(this.reflector, context, payload);
    } catch (ex) {
      return false;
    }
  }

  /**
   * @function handleRequest
   * @description ถ้าข้อมูลไม่ถูกต้อง
   */
  handleRequest(error: any, authInfo: any, errInfo: any) {
    if (authInfo && !error && !errInfo) {
      return authInfo;
    } else {
      return (
        error ||
        new HttpUnauthorizedError(undefined, errInfo && errInfo.message)
      );
    }
  }
}

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (isAllowAnonymous(this.reflector, context)) {
      return true;
    }

    const { headers } = context.switchToHttp().getRequest<express.Request>();
    const token = TokenService.getTokenFromHeader(headers);

    // TODO: Change type to FirebaseTokenPayload
    if (!token) return false;

    const payload = TokenService.decode(token) as any;
    return isUserAllowedAccess(this.reflector, context, payload);
  }
}
