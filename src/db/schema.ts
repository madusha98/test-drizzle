import { eq, relations, sql } from 'drizzle-orm';

import {
  boolean,
  index,
  integer,
  pgMaterializedView,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 256 }),
  street: varchar('street', { length: 256 }),
  state: varchar('state', { length: 256 }),
  zipCode: varchar('zip_code', { length: 256 }),
  userId: integer('user_id').references(() => users.id),
});

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('firstName', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
    email: varchar('email', { length: 256 }).unique(),
    addressId: integer('address_id').references(() => addresses.id),
  },
  (table) => ({
    searchIndex: index('search_index').using(
      'gin',
      sql`to_tsvector('english', coalesce(${table.firstName}, '') || ' ' || coalesce(${table.lastName}, '') || ' ' || coalesce(${table.email}, ''))`,
    ),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  address: one(addresses, {
    fields: [users.id],
    references: [addresses.userId],
  }),
}));

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at').defaultNow(),
  createdBy: uuid('created_by'),
  modifiedBy: uuid('modified_by'),
});

// Define the `vendors` table
export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  emoji: varchar('emoji', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at').defaultNow(),
  createdBy: uuid('created_by'),
  modifiedBy: uuid('modified_by'),
});

// Define the `offers` table
export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  city: varchar('city', { length: 100 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  unlimited: boolean('unlimited').default(false),
  seasonal: boolean('seasonal').default(false),
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => vendors.id),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id),
  clickCount: integer('click_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at').defaultNow(),
  createdBy: uuid('created_by'),
  modifiedBy: uuid('modified_by'),
});

export const searchableOffers = pgMaterializedView('searchable_offers').as(
  (qb) =>
    qb
      .select({
        offerId: offers.id,
        title: offers.title,
        description: offers.description,
        categoryName: categories.name,
        vendorName: vendors.name,
      })
      .from(offers)
      .leftJoin(categories, eq(offers.categoryId, categories.id))
      .leftJoin(vendors, eq(offers.vendorId, vendors.id)),
);
