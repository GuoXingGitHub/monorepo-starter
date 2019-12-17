import * as cls from 'cls-hooked';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';

import { HttpException, HttpStatus } from '@nestjs/common';

import { TokenService } from './token.service';

export class RequestContext {
  public static nsid = uuid();
  public readonly id: Number;
  public request: IncomingMessage;

  constructor(request: IncomingMessage) {
    this.id = Math.random();
    this.request = request;
  }

  public static fromRequest(request: IncomingMessage): RequestContext {
    const requestContext = new RequestContext(request);
    return requestContext;
  }

  public static currentRequestContext(): RequestContext | null {
    const session = cls.getNamespace(RequestContext.nsid);
    if (session && session.active) {
      return session.get(RequestContext.name);
    }

    return null;
  }

  public static currentRequest(): IncomingMessage | null {
    let requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.request;
    }

    return null;
  }

  // TODO: Change return type to FirebaseTokenPayload
  public static currentUser(throwError?: boolean): any {
    let requestContext = RequestContext.currentRequestContext();
    let payload: any = null;

    if (!requestContext && throwError) throw this.unauthorized();
    if (!requestContext) return null;

    const {
      request: { headers },
    } = requestContext;

    const token = TokenService.getTokenFromHeader(headers);
    if (token) {
      payload = jwt.decode(token) as any;
    }

    if (throwError && !payload) {
      throw this.unauthorized();
    }

    return payload;
  }

  public static currentToken(): string | undefined {
    let requestContext = RequestContext.currentRequestContext();

    if (!requestContext) throw this.unauthorized();

    const {
      request: { headers },
    } = requestContext;

    return TokenService.getTokenFromHeader(headers);
  }

  private static unauthorized() {
    return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  public static currentUID(): string {
    return RequestContext.currentUser(true).user_id;
  }

  public static isAuthenticated() {
    return !!RequestContext.currentUser();
  }

  public static hasAnyRoles(...roles: string[]): boolean {
    const user = RequestContext.currentUser();
    if (!user) return false;
    const { roles: userRoles = [] } = user;
    return userRoles.some((userRole: any) => roles.includes(userRole));
  }
}
