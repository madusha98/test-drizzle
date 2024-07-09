import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import * as schema from './db/schema';

import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';

@Module({
  imports: [
    UserModule,
    DrizzlePGModule.register({
      tag: 'DB_DEV',
      pg: {
        connection: 'client',
        config: {
          connectionString:
            'postgresql://user:password@localhost:5432/test_drizzle',
        },
      },
      config: { schema: { ...schema } },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
