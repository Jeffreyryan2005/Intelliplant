import { SkeletonDocument } from '../components/LoadingStates';

export default function Loading() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <div className="skeleton w-48 h-8 mb-2" />
        <div className="skeleton w-80 h-4" />
      </div>
      <div className="skeleton w-full h-40 rounded-2xl" />
      <div className="skeleton w-full h-10 max-w-md rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonDocument key={i} />)}
      </div>
    </div>
  );
}
