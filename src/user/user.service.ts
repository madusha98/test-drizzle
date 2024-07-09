import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject('DB_DEV') private db: PostgresJsDatabase<typeof schema>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.db.transaction(async (tx) => {
      const address = await tx
        .insert(schema.addresses)
        .values(createUserDto.address)
        .returning({ id: schema.addresses.id });

      const user = await tx
        .insert(schema.users)
        .values({ ...createUserDto, addressId: address[0].id })
        .returning({ id: schema.addresses.id });

      await tx
        .update(schema.addresses)
        .set({ userId: user[0].id })
        .where(eq(schema.addresses.id, address[0].id))
        .execute();
    });
  }

  async findAll(limit: number, offset: number, searchTerm: string) {
    // Add search condition
    if (searchTerm) {
      const modifiedSearchTerm = searchTerm
        .split(' ')
        .map((term) => `${term}:*`)
        .join(' & ');

      return this.db
        .select()
        .from(schema.users)
        .where(
          sql`to_tsvector('english', coalesce("firstName", '') || ' ' || coalesce("last_name", '') || ' ' || coalesce("email", '')) @@ to_tsquery('english', ${modifiedSearchTerm})`,
        )
        .limit(limit)
        .offset(offset)
        .execute();
    }

    return this.db
      .select()
      .from(schema.users)
      .limit(limit)
      .offset(offset)
      .execute();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
