import { SkeletonLine, SkeletonCard } from '../components/LoadingStates';

export default function ComplianceLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <SkeletonLine width="w-1/3" height="h-10 mb-2" />
        <SkeletonLine width="w-1/4" height="h-5" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          <SkeletonLine width="w-full" height="h-64 rounded-xl" />
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLine key={i} width="w-full" height="h-32 rounded-xl" />
          ))}
        </div>
      </div>
      
      <SkeletonLine width="w-full" height="h-[400px] rounded-xl" />
    </div>
  );
}
