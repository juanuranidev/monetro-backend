import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@core/strategies/jwt.strategy';
import { UserModule } from '@user/user.module';
import { LoginUserUseCase } from '@auth/application/use-cases/login-user/login-user.use-case';
import { RegisterUserUseCase } from '@auth/application/use-cases/register-user/register-user.use-case';
import { AuthController } from '@auth/infrastructure/controllers/auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            config.get<string>('JWT_EXPIRES_SECONDS', `${60 * 60 * 24 * 7}`),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [RegisterUserUseCase, LoginUserUseCase, JwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
