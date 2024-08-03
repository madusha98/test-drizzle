import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { UUID } from 'crypto';
import { eq } from 'drizzle-orm';

@Injectable()
export class VendorsService {
  constructor(
    @Inject('DB_DEV') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const result = await this.db
      .insert(schema.vendors)
      .values(createVendorDto)
      .returning({ id: schema.vendors.id })
      .execute();
    return result[0];
  }

  async findAll() {
    return this.db.select().from(schema.vendors).execute();
  }

  async findOne(id: UUID) {
    const vendors = await this.db
      .select()
      .from(schema.vendors)
      .where(eq(schema.vendors.id, id))
      .execute();

    if (vendors.length === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendors[0];
  }

  async update(id: UUID, updateVendorDto: UpdateVendorDto) {
    const result = await this.db
      .update(schema.vendors)
      .set(updateVendorDto)
      .where(eq(schema.vendors.id, id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return result[0];
  }

  async remove(id: UUID) {
    const result = await this.db
      .delete(schema.vendors)
      .where(eq(schema.vendors.id, id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return result[0];
  }
}
