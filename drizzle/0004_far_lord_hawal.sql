-- Custom SQL migration file, put you code below! --
CREATE MATERIALIZED VIEW searchable_offers AS
SELECT
    offers.id AS offer_id,
    offers.title,
    offers.description,
    categories.name AS category_name,
    vendors.name AS vendor_name
FROM
    offers
JOIN
    categories ON offers.category_id = categories.id
JOIN
    vendors ON offers.vendor_id = vendors.id;

-- Create a PGroonga index on the materialized view
CREATE INDEX idx_searchable_offers ON searchable_offers USING pgroonga (
    (title || ' ' || description || ' ' || category_name || ' ' || vendor_name)
);
