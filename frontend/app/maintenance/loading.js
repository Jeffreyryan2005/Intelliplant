import { SkeletonLine, SkeletonCard } from '../components/LoadingStates';

export default function MaintenanceLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <SkeletonLine width="w-1/3" height="h-10 mb-2" />
        <SkeletonLine width="w-1/4" height="h-5" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLine key={i} width="w-full" height="h-28 rounded-xl" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SkeletonLine width="w-full" height="h-96 rounded-xl" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLine key={i} width="w-full" height="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
