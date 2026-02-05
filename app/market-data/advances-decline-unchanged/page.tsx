'use client';

import { AuthGuard } from '@/components/common';
import AdvancesDeclineTable from '@/components/AdvancesDeclineTable';

function AdvancesDeclineContent() {
  return <AdvancesDeclineTable />;
}

export default function AdvancesDeclinePage() {
  return (
    <AuthGuard loadingMessage="Loading market data...">
      <AdvancesDeclineContent />
    </AuthGuard>
  );
}
