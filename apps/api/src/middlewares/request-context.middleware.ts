import * as cls from 'cls-hooked';

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { RequestContext } from '../providers/request-context';
import { IncomingMessage } from 'http';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor() {}

  isBasicAuth(request: IncomingMessage) {
    const { headers } = request;
    return (
      headers &&
      headers.authorization &&
      headers.authorization.startsWith('Basic')
    );
  }

  /**
   * Resolved request
   * @param request: [Request]
   * @returns email: string
   */
  resolveBasicAuth(request: IncomingMessage): string {
    const { headers } = request;

    if (!headers.authorization) throw new UnauthorizedException();

    return Buffer.from(headers.authorization.substr(6), 'base64')
      .toString()
      .split(':')[0];
  }

  async use(req: IncomingMessage, res: any, next: () => void) {
    let requestContext: RequestContext | null = null;
    // if (this.configService.isDevelopment() && this.isBasicAuth(req)) {
    // if (this.isBasicAuth(req)) {
    //   const email: string = this.resolveBasicAuth(req);
    //   try {
    //     const token = await this.userService
    //       .findByEmail(email)
    //       .then(user => this.authService.sign(user, 'accessToken'));
    //     req.headers['authorization'] = `Bearer ${token}`;
    //     requestContext = RequestContext.fromRequest(req);
    //   } catch (ex) {
    //     next(new ForbiddenException('Email or Password is wrong.'));
    //   }
    // } else {
    //   // From JWT Token
    requestContext = RequestContext.fromRequest(req);
    // }
    const session =
      cls.getNamespace(RequestContext.nsid) ||
      cls.createNamespace(RequestContext.nsid);
    session.run(async () => {
      session.set(RequestContext.name, requestContext);
      next();
    });
  }
}
