import { Suspense } from 'react';
import XRaiseContent from '@/components/features/XRaise/XRaiseContent';

export default function StartupXRaisePage() {
  return (
    <Suspense fallback={null}>
      <XRaiseContent />
    </Suspense>
  );
}
