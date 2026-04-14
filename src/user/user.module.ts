import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUserProfileUseCase } from '@user/application/use-cases/get-user-profile/get-user-profile.use-case';
import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import { UserProfileController } from '@user/infrastructure/controllers/user-profile.controller';
import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';
import { UserTypeOrmRepository } from '@user/infrastructure/postgres/repositories/user.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UserProfileController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    GetUserProfileUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
