CREATE INDEX offers_search_index ON searchable_offers USING gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category_name, '') || ' ' || coalesce(vendor_name, ''))
);