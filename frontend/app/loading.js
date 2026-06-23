import { SkeletonCard, SkeletonLine } from './components/LoadingStates';

export default function Loading() {
  return (
    <div className="p-4 lg:p-6 space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="glass-card p-6 lg:p-8">
        <div className="skeleton w-40 h-4 mb-3" />
        <div className="skeleton w-72 h-8 mb-2" />
        <div className="skeleton w-96 h-4" />
      </div>
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton w-full h-14 rounded-xl" />)}
        </div>
        <div className="glass-card p-5 lg:col-span-2 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton w-full h-10" />)}
        </div>
      </div>
    </div>
  );
}
