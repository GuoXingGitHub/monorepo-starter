import * as jwt from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';

export const BEARER_AUTH_SCHEME = 'Bearer';

export class TokenService {
  public static getTokenFromHeader(headers: IncomingHttpHeaders) {
    const authHeader = headers['authorization'];
    if (!authHeader || !authHeader.startsWith(BEARER_AUTH_SCHEME))
      return undefined;
    return authHeader.slice(7);
  }

  public static decode(idToken: string) {
    return jwt.decode(idToken);
  }
}
