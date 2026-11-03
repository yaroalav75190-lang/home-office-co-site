import { clsx } from 'clsx'
import { Coast, type DistrictId } from '@/components/coast'

/**
 * The district page's large locator (art-direction §6 `/thailand/phuket/bang-tao`: «локатор 60svh
 * с отрезком»): the island ink-muted, the district's segment 3 px laterite. Static like every
 * locator (§5), so no `data-coast-draw`. The box keeps the island's ratio; give it a height.
 */
export function DistrictMap({ district, label, className }: { district: DistrictId; label: string; className?: string }) {
  return (
    <div className={clsx('relative aspect-[415/1000]', className)}>
      <Coast id="phuket-island" highlight={district} title={label} className="absolute inset-0 size-full" />
    </div>
  )
}
