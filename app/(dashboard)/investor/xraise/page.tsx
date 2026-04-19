import { Suspense } from 'react';
import XRaiseContent from '@/components/features/XRaise/XRaiseContent';

export default function InvestorXRaisePage() {
  return (
    <Suspense fallback={null}>
      <XRaiseContent />
    </Suspense>
  );
}
