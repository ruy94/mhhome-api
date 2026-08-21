# Audit SPX returns before status 6003

SPX status `6001/Returning` means the parcel is still returning. Only
`6003/Returned` confirms that it has reached the sender and may move the local
order to `Return` and restore inventory.

Use this read-only query to find local orders that may have been returned too
early by the former `6001` mapping:

```sql
SELECT
  o.id,
  o.code,
  o.status,
  so.tracking_no,
  MIN(se.happened_at) FILTER (WHERE se.status_code = '6001') AS returning_at
FROM orders AS o
JOIN shipping_orders AS so ON so.order_id = o.id
JOIN shipping_events AS se ON se.shipping_order_id = so.id
WHERE so.managed_by = 'Local'
  AND o.status = 'Return'
GROUP BY o.id, o.code, o.status, so.tracking_no
HAVING BOOL_OR(se.status_code = '6001')
   AND NOT BOOL_OR(se.status_code = '6003')
ORDER BY returning_at DESC;
```

Review each result against SPX before changing status or stock. Do not run an
automatic stock correction because the previous return may already have been
handled manually.
