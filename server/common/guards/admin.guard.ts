import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { appConfig } from '@server/config/app.config';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const token = request.headers['x-admin-token'];

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('缺少管理员令牌');
    }

    if (token !== appConfig.adminToken) {
      throw new UnauthorizedException('管理员令牌无效');
    }

    return true;
  }
}
