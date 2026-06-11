'use client';

import { AuthGuard } from '@/components/common';
import GlobalMarketsTable from '@/components/GlobalMarketsTable';

function GlobalMarketsContent() {
  return <GlobalMarketsTable />;
}

export default function GlobalMarketsPage() {
  return (
    <AuthGuard loadingMessage="Loading global markets...">
      <GlobalMarketsContent />
    </AuthGuard>
  );
}
