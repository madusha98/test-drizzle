import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { UUID } from 'crypto';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('DB_DEV') private db: PostgresJsDatabase<typeof schema>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.db
      .insert(schema.categories)
      .values(createCategoryDto)
      .returning({ id: schema.categories.id })
      .execute();
    return result[0];
  }

  findAll() {
    return this.db.select().from(schema.categories).execute();
  }

  findOne(id: UUID) {
    return this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .execute();
  }

  update(id: UUID, updateCategoryDto: UpdateCategoryDto) {
    return this.db
      .update(schema.categories)
      .set(updateCategoryDto)
      .where(eq(schema.categories.id, id))
      .execute();
  }

  remove(id: UUID) {
    return this.db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .execute();
  }
}
