/**
 * One-time script: Force refresh StockMaster with ALL equity stocks (all series).
 * Run with: npx tsx scripts/force-refresh.ts
 */

import { prisma } from '../lib/prisma';
import { getScripMaster, clearScripMasterCache } from '../lib/dhan/scripMaster';

async function main() {
  console.log('=== Force Refresh StockMaster ===\n');

  // 1. Invalidate DB cache so getScripMaster re-downloads CSV
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const updated = await prisma.stockMaster.updateMany({
    data: { refreshedAt: twoDaysAgo },
  });
  console.log(`[1/4] Invalidated ${updated.count} StockMaster rows (set refreshedAt to ${twoDaysAgo.toISOString()})`);

  // 2. Clear in-memory cache
  clearScripMasterCache();
  console.log('[2/4] Cleared in-memory scrip cache');

  // 3. Force re-download by calling getScripMaster (will see DB as stale → download CSV)
  console.log('[3/4] Downloading fresh Dhan CSV and persisting to DB...');
  const nse = await getScripMaster('NSE');
  clearScripMasterCache(); // clear so BSE gets fresh load too
  const bse = await getScripMaster('BSE');

  console.log(`\n[4/4] Done!`);
  console.log(`  NSE stocks: ${nse.length}`);
  console.log(`  BSE stocks: ${bse.length}`);
  console.log(`  Total: ${nse.length + bse.length}`);

  // Show series breakdown for NSE
  const nseSeries: Record<string, number> = {};
  for (const s of nse) {
    nseSeries[s.series] = (nseSeries[s.series] || 0) + 1;
  }
  console.log('\n  NSE Series Breakdown:');
  Object.entries(nseSeries)
    .sort((a, b) => b[1] - a[1])
    .forEach(([s, c]) => console.log(`    ${s}: ${c}`));

  // Count how many stocks in DB total
  const dbCount = await prisma.stockMaster.count();
  console.log(`\n  Total in StockMaster DB: ${dbCount}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
