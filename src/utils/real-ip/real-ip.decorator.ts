import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestIp } from './request-ip';

export const RealIP = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new RequestIp(request).getClientIp();
});

export const RealIp = RealIP;