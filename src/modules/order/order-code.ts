import { createHash, randomInt } from 'node:crypto';

export function generateOrderCode(): string {
  const seed = `${Date.now()}-${process.hrtime.bigint().toString()}-${randomInt(1, 1_000_000_000)}`;
  const hash = createHash('sha256').update(seed).digest('hex');
  let digits = hash.replace(/\D/g, '');
  if (digits.length < 10) digits += Date.now().toString();
  const firstDigit = digits[0] === '0' ? randomInt(1, 10).toString() : digits[0];
  return firstDigit + digits.substring(1, 10);
}
