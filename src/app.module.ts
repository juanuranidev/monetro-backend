import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
// import { AccountMongoModule } from './account/infrastructure/mongo/account-mongo.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CurrencyModule } from './currency/currency.module';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { DatabaseSeedService } from './database/database-seed.service';
import { HealthController } from './health/health.controller';
import { RuleModule } from './rule/rule.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

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
    /*
     * MongoDB (Mongoose) — optional second connection. Uncomment when you add
     * @nestjs/mongoose + mongoose and wire a real AccountMongoRepository using
     * MongooseModule.forFeature([...]). The simulated AccountMongoModule works
     * without this block (in-memory only).
     *
     * MongooseModule.forRootAsync({
     *   imports: [ConfigModule],
     *   inject: [ConfigService],
     *   useFactory: (config: ConfigService) => ({
     *     uri: config.getOrThrow<string>('MONGO_URI'),
     *   }),
     * }),
     */
    UserModule,
    AuthModule,
    CurrencyModule,
    AccountModule,
    // AccountMongoModule — swap with AccountModule for Mongo simulation; then also
    // switch AccountModule → AccountMongoModule in rule.module.ts and transaction.module.ts imports.
    // AccountMongoModule,
    CategoryModule,
    RuleModule,
    TransactionModule,
  ],
  controllers: [HealthController],
  providers: [
    DatabaseSeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
