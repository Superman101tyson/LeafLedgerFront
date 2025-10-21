-- Example Nightly Materializer for daily_variant_market
-- This would run as a scheduled job (e.g., cron, Airflow, dbt)

-- Step 1: Compute daily store-level snapshot
INSERT INTO daily_variant_store (date, variant_id, store_id, price, in_stock, on_sale, price_per_gram)
SELECT
  DATE(observed_at) as date,
  variant_id,
  store_id,
  AVG(price) as price,
  BOOL_OR(in_stock) as in_stock,
  BOOL_OR(on_sale) as on_sale,
  AVG(price / NULLIF(CAST(REGEXP_REPLACE(pv.size, '[^0-9.]', '', 'g') AS NUMERIC), 0)) as price_per_gram
FROM menu_observations mo
INNER JOIN product_variants pv ON mo.variant_id = pv.id
WHERE DATE(observed_at) = CURRENT_DATE - INTERVAL '1 day'
GROUP BY DATE(observed_at), variant_id, store_id
ON CONFLICT (date, variant_id, store_id) DO UPDATE
SET
  price = EXCLUDED.price,
  in_stock = EXCLUDED.in_stock,
  on_sale = EXCLUDED.on_sale,
  price_per_gram = EXCLUDED.price_per_gram;

-- Step 2: Compute market-level metrics
INSERT INTO daily_variant_market (
  date,
  variant_id,
  min_price,
  median_price,
  p90_price,
  coverage,
  delta_7d,
  delta_30d,
  rank_in_market,
  gap_to_median,
  promo_rate
)
SELECT
  date,
  variant_id,
  MIN(price) as min_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY price) as p90_price,
  COUNT(DISTINCT store_id) as coverage,
  
  -- 7-day delta
  (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) - 
   LAG(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price), 7) OVER (PARTITION BY variant_id ORDER BY date)
  ) / NULLIF(LAG(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price), 7) OVER (PARTITION BY variant_id ORDER BY date), 0) * 100 as delta_7d,
  
  -- 30-day delta
  (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) - 
   LAG(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price), 30) OVER (PARTITION BY variant_id ORDER BY date)
  ) / NULLIF(LAG(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price), 30) OVER (PARTITION BY variant_id ORDER BY date), 0) * 100 as delta_30d,
  
  -- Rank (computed in next step per store)
  NULL as rank_in_market,
  NULL as gap_to_median,
  
  -- Promo rate
  AVG(CASE WHEN on_sale THEN 1.0 ELSE 0.0 END) as promo_rate
FROM daily_variant_store
WHERE date = CURRENT_DATE - INTERVAL '1 day'
GROUP BY date, variant_id
ON CONFLICT (date, variant_id) DO UPDATE
SET
  min_price = EXCLUDED.min_price,
  median_price = EXCLUDED.median_price,
  p90_price = EXCLUDED.p90_price,
  coverage = EXCLUDED.coverage,
  delta_7d = EXCLUDED.delta_7d,
  delta_30d = EXCLUDED.delta_30d,
  promo_rate = EXCLUDED.promo_rate;

-- Step 3: Update rank and gap for "your store" (per org)
-- This would run per organization to compute their competitive position
-- Example for a specific store (in practice, loop through orgs)
WITH ranked AS (
  SELECT
    dvs.date,
    dvs.variant_id,
    dvs.store_id,
    dvs.price,
    ROW_NUMBER() OVER (PARTITION BY dvs.date, dvs.variant_id ORDER BY dvs.price ASC) as rank,
    dvm.median_price
  FROM daily_variant_store dvs
  INNER JOIN daily_variant_market dvm ON dvs.date = dvm.date AND dvs.variant_id = dvm.variant_id
  WHERE dvs.date = CURRENT_DATE - INTERVAL '1 day'
    AND dvs.store_id = 'YOUR_STORE_ID' -- parameterize per org
)
UPDATE daily_variant_market dvm
SET
  rank_in_market = ranked.rank,
  gap_to_median = ranked.price - ranked.median_price
FROM ranked
WHERE dvm.date = ranked.date
  AND dvm.variant_id = ranked.variant_id;

-- Step 4: Alert triggers (example for undercut alerts)
-- This would check rules and create alert inbox items
INSERT INTO alert_inbox (organization_id, rule_id, type, message, timestamp, variant_id, store_id)
SELECT
  ar.organization_id,
  ar.id as rule_id,
  'undercut' as type,
  FORMAT(
    '%s is pricing %s %s %s%% below your price (%s vs %s)',
    comp_store.name,
    pv.brand || ' ' || pv.name,
    pv.size,
    ROUND(((your_price.price - comp_price.price) / your_price.price * 100)::numeric, 1),
    TO_CHAR(comp_price.price, 'FM$999.99'),
    TO_CHAR(your_price.price, 'FM$999.99')
  ) as message,
  NOW() as timestamp,
  comp_price.variant_id,
  comp_price.store_id
FROM alert_rules ar
CROSS JOIN LATERAL (
  SELECT store_id FROM org_store_allowlist
  WHERE organization_id = ar.organization_id
  LIMIT 1 -- your primary store
) your_store
INNER JOIN daily_variant_store your_price
  ON your_price.store_id = your_store.store_id
  AND your_price.date = CURRENT_DATE - INTERVAL '1 day'
INNER JOIN daily_variant_store comp_price
  ON comp_price.variant_id = your_price.variant_id
  AND comp_price.date = your_price.date
  AND comp_price.store_id != your_store.store_id
INNER JOIN master_stores comp_store ON comp_price.store_id = comp_store.id
INNER JOIN product_variants pv ON comp_price.variant_id = pv.id
WHERE ar.type = 'undercut'
  AND ar.enabled = true
  AND ((your_price.price - comp_price.price) / your_price.price * 100) >= (ar.config->>'threshold')::numeric
  AND NOT EXISTS (
    SELECT 1 FROM alert_inbox
    WHERE organization_id = ar.organization_id
      AND rule_id = ar.id
      AND variant_id = comp_price.variant_id
      AND store_id = comp_price.store_id
      AND timestamp > NOW() - INTERVAL '24 hours'
  );


