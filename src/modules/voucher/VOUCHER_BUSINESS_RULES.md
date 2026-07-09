# Voucher Business Rules

This module supports three voucher scopes:

- `Order`: shop/order voucher. Applies to the retail subtotal after product-item vouchers. Wholesale lines do not contribute to this base amount. If the calculated discount is `0`, the voucher must be rejected and must not be consumed.
- `Product`: item voucher for selected products. Applies only to eligible retail lines of the configured products. It does not apply to wholesale lines or active flash-sale lines. One product can use at most one item voucher, and one item voucher can be used for at most one product in the same order.
- `Shipping`: freeship voucher. Applies to the shipping fee when `type = Freeship`. The minimum order condition uses the current checkout amount rule from the order quote flow.

Voucher types:

- `Normal`: public voucher. Can be used for order or product scope.
- `Secret`: private voucher. Can be saved or applied by code, then follows its scope rules.
- `Hidden`: code-only/private voucher. Can be saved or applied by code, then follows its scope rules.
- `Freeship`: shipping-only voucher. It must use `Shipping` scope.

Common eligibility checks:

- Voucher must match the platform `conditionType` (`ZaloMiniApp`, `Website`, etc.).
- Voucher must be active, not deleted, within `validFrom` and `validUntil`, and under `usageLimit` when configured.
- `minOrderValue` is checked against the voucher-specific base amount.
- A voucher that is accepted by checkout is consumed once per unique voucher id.

Wholesale behavior:

- A product is sold in wholesale mode only when `Product.wholesaleEnabled = true` and the buyer is in `ProductWholesaleUser` for that product.
- Wholesale lines use `Variant.wholesalePrice`, require `wholesaleMinQuantity`, and do not receive flash-sale pricing.
- Wholesale lines are excluded from product vouchers and order voucher discount bases.
- Shipping vouchers can still apply to orders containing wholesale lines when the shipping voucher conditions are met.
