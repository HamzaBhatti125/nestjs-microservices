import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    if (!this.authService) {
      throw new Error('AuthServiceClient is not initialized');
    }
    this.logger.log('AuthServiceClient initialized successfully');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      return false; // No JWT found in cookies
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authService.authenticate({ Authentication: jwt }).pipe(
      tap((res) => {
        if (roles) {
          for (const role of roles) {
            const hasRole = res.roles?.some((r) => r.name === role);

            if (!hasRole) {
              this.logger.error('The user does not have the required role');
              throw new UnauthorizedException();
            }
          }
        }
        context.switchToHttp().getRequest().user = { ...res, _id: res.id };
      }),
      map(() => true),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      }),
    );
  }
}
