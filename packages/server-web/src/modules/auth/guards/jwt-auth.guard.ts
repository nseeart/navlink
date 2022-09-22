import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/core/const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    // canActivate(context: ExecutionContext) {
    //     const isPublic = this.reflector.getAllAndOverride<boolean>(
    //         IS_PUBLIC_KEY,
    //         [context.getHandler(), context.getClass()],
    //     );
    //     if (isPublic) {
    //         return true;
    //     }
    //     return super.canActivate(context);
    // }

    handleRequest(err, user, info, context) {
        // if (err || !user) {
        //     throw err || new UnauthorizedException('用户没授权');
        // }
        // return user;
        // const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (user) return user;
        if (isPublic) return true;
        throw new UnauthorizedException('用户没授权');
    }
}
