import Skeleton from './Skeleton';

export default function HomeSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Banner Skeleton */}
      <div style={{ margin: '1rem -1.25rem 1.5rem' }}>
        <Skeleton height={280} borderRadius={0} />
      </div>

      {/* Categories Skeleton */}
      <div className="home-section">
        <div className="section-header">
          <Skeleton width={100} height={24} />
          <Skeleton width={50} height={20} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'hidden', padding: '0.5rem 0' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Skeleton width={64} height={64} borderRadius="50%" />
              <Skeleton width={50} height={12} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Skeleton */}
      <div className="home-section" style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <Skeleton width={150} height={24} />
        </div>
        <div className="grid-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton height={160} borderRadius={20} />
              <Skeleton width="80%" height={18} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={50} height={20} />
                <Skeleton width={32} height={32} borderRadius={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
