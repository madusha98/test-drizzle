import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { UUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class OffersService {
  constructor(
    @Inject('DB_DEV') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    console.log(typeof createOfferDto.endDate);

    const result = await this.db
      .insert(schema.offers)
      .values(createOfferDto)
      .returning({ id: schema.offers.id })
      .execute();
    return result[0];
  }

  async findAll() {
    return this.db.select().from(schema.offers).execute();
  }

  async findOne(id: UUID) {
    const offers = await this.db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.id, id))
      .execute();

    if (offers.length === 0) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offers[0];
  }

  async update(id: UUID, updateOfferDto: UpdateOfferDto) {
    const result = await this.db
      .update(schema.offers)
      .set(updateOfferDto)
      .where(eq(schema.offers.id, id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return result[0];
  }

  async remove(id: UUID) {
    const result = await this.db
      .delete(schema.offers)
      .where(eq(schema.offers.id, id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return result[0];
  }

  async search(query: string, limit: number = 10, offset: number = 0) {
    function formatQuery(input) {
      // Split the input string into words and join them with the '&' operator
      return input
        .split(/\s+/) // Split by whitespace
        .map((word) => `${word}:*`) // Add prefix matching for each word
        .join(' & '); // Join with 'AND' operator
    }

    const formattedQuery = formatQuery(query);

    const totalCountResult = await this.db.execute(
      sql`
        SELECT COUNT(*) AS total_count
        FROM ${schema.searchableOffers}
        WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category_name, '') || ' ' || coalesce(vendor_name, ''))
        @@ to_tsquery('english', ${formattedQuery})
      `,
    );

    console.log(totalCountResult);

    const totalCount = totalCountResult.rows[0].total_count as number;

    // Get the paginated results
    const results = await this.db.execute(
      sql`
        SELECT *
        FROM ${schema.searchableOffers}
        WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category_name, '') || ' ' || coalesce(vendor_name, ''))
        @@ to_tsquery('english', ${formattedQuery})
        LIMIT ${limit} OFFSET ${offset}
      `,
    );

    return { totalCount, results: results.rows };

    return results;
  }
}
