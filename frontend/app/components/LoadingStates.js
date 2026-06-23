'use client';

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="skeleton w-11 h-11 rounded-xl" />
        <div className="skeleton w-16 h-6 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="skeleton w-24 h-7" />
        <div className="skeleton w-32 h-4" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`skeleton ${width} ${height}`} />;
}

export function SkeletonDocument() {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="skeleton w-3/4 h-4" />
        <div className="skeleton w-full h-3" />
        <div className="skeleton w-1/2 h-3" />
        <div className="flex gap-2">
          <div className="skeleton w-16 h-5 rounded-md" />
          <div className="skeleton w-16 h-5 rounded-md" />
          <div className="skeleton w-16 h-5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-3">
        <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
        <div className="skeleton w-48 h-10 rounded-2xl" />
      </div>
      <div className="flex gap-3 flex-row-reverse">
        <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
        <div className="space-y-2 flex-1 max-w-[80%]">
          <div className="skeleton w-full h-32 rounded-2xl" />
          <div className="skeleton w-40 h-4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGraph() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="skeleton absolute w-6 h-6 rounded-full"
              style={{
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <div className="skeleton w-40 h-4 mx-auto" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size]} border-2 border-white/10 border-t-accent-blue rounded-full animate-spin`} />
  );
}
