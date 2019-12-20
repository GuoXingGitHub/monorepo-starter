import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as databaseConfig from './config/database';
import { GCloudModule } from './gcloud/gcloud.module';
import { RequestContextMiddleware } from './middlewares';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { EmployeeModule } from './modules/employee/employee.module';

Logger.log(databaseConfig, 'AppModule DBConfig');

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    GCloudModule,
    AttachmentModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
