-- Query data with duckdb. 
-- Start duckdb with `$ duckdb off.db`

-- Create a table of codes
CREATE TABLE codes AS
  SELECT 
    json->>'code' as code, 
    SUBSTR(json->>'code', 1, LENGTH(json->>'code') - 4) as company_code, 
    json->>'brands' as brands, 
    json->'brands_tags' as brands_tags, 
    json->>'product_name' as product_name,  
    json->'origins_tags' as origins_tags, 
    json->>'packaging_lc' as packaging_lc  
  FROM read_ndjson('openfoodfacts-products.jsonl.gz', ignore_errors=True);

  -- Get brands_tag with clean company name
  CREATE TABLE brands AS (
  WITH unnested_codes AS (
    SELECT 
      code,
      company_code,
      brands,
      product_name,
      packaging_lc,
      unnest(from_json(brands_tags, '["varchar"]')) as brands_tag
    FROM codes
  ),
  by_brands_tag as (
    SELECT 
      brands_tag, 
      brands, 
      array_slice(array_agg(distinct code), 0, 20) as sample_codes, 
      -- array_agg(distinct company_code) as company_codes, 
      count(*) as count,
      ROW_NUMBER() OVER (PARTITION BY brands_tag ORDER BY count(*) DESC) as row_number
    FROM unnested_codes 
    -- WHERE brands_tag = 'kitkat'
    GROUP BY 1, 2
  )
  SELECT * FROM by_brands_tag 
  WHERE row_number = 1
);

-- Get brands_tag with clean company name
SELECT * FROM brands 
WHERE count > 80
ORDER BY count DESC;

-- Get brands_tag with clean company name as file
COPY (
  SELECT * FROM brands 
  WHERE count > 80
  ORDER BY count DESC
) TO 'brands.csv' WITH (FORMAT CSV, HEADER);

-- Get brands_tag with clean company name as json
COPY (
  SELECT brands_tag, brands as name, count
  FROM brands 
  WHERE count > 80
  ORDER BY count DESC
) TO 'brands.json' WITH (FORMAT json, ARRAY true);

