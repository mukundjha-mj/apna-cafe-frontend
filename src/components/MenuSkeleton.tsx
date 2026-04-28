import Skeleton from './Skeleton';

export default function MenuSkeleton({ hideCategories = false }: { hideCategories?: boolean }) {
  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      {/* Categories Scroll Skeleton */}
      {!hideCategories && (
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'hidden', padding: '1rem 0' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} width={80} height={34} borderRadius={20} />
          ))}
        </div>
      )}

      {/* Menu Items List Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '16px' }}>
            <Skeleton width={100} height={100} borderRadius={12} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Skeleton width="60%" height={20} />
                <Skeleton width="90%" height={14} style={{ marginTop: '8px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={60} height={24} />
                <Skeleton width={80} height={32} borderRadius={8} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
