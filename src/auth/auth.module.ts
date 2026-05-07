import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoginUseCase } from '@auth/application/use-cases/login/login.use-case';
import { AuthController } from '@auth/infrastructure/controllers/auth.controller';
import { RegisterUseCase } from '@auth/application/use-cases/register/register.use-case';

import { JwtStrategy } from '@core/strategies/jwt.strategy';

import { UserModule } from '@user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const raw: string = config.get<string>('JWT_EXPIRES_SECONDS', '604800');
        const expiresIn: number = Number.parseInt(raw, 10);
        return {
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: Number.isNaN(expiresIn) ? 604800 : expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, RegisterUseCase, LoginUseCase],
})
export class AuthModule {}
