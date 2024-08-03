import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import * as schema from './db/schema';

import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { CategoriesModule } from './categories/categories.module';
import { VendorsModule } from './vendors/vendors.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [
    UserModule,
    CategoriesModule,
    VendorsModule,
    OffersModule,
    DrizzlePGModule.register({
      tag: 'DB_DEV',
      pg: {
        connection: 'client',
        config: {
          connectionString: 'postgresql://admin:password@localhost:5432/test',
        },
      },
      config: { schema: { ...schema } },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
