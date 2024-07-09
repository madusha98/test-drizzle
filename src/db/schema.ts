import { relations, sql } from 'drizzle-orm';
import { index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

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
