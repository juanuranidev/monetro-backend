import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountModule } from '@account/account.module';

import { AuthModule } from '@auth/auth.module';

import { CategoryModule } from '@category/category.module';

import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';

import { CurrencyModule } from '@currency/currency.module';

import { DatabaseSeedService } from '@database/database-seed.service';

import { HealthController } from '@health/health.controller';

import { RuleModule } from '@rule/rule.module';

import { TransactionModule } from '@transaction/transaction.module';

import { UserModule } from '@user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dialect: string = config.get<string>('DB_DIALECT', 'postgres');
        if (dialect === 'sqlite') {
          return {
            type: 'sqlite' as const,
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            logging: config.get<string>('TYPEORM_LOGGING', 'false') === 'true',
          };
        }
        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: Number(config.get<string>('DB_PORT', '5432')),
          username: config.get<string>('DB_USER', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'monetro'),
          autoLoadEntities: true,
          synchronize: config.get<string>('TYPEORM_SYNC', 'false') === 'true',
          logging: config.get<string>('TYPEORM_LOGGING', 'false') === 'true',
        };
      },
    }),
    AuthModule,
    RuleModule,
    UserModule,
    AccountModule,
    CategoryModule,
    CurrencyModule,
    TransactionModule,
  ],
  controllers: [HealthController],
  providers: [
    DatabaseSeedService,
    MergeAuthenticatedUserIdInterceptor,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
