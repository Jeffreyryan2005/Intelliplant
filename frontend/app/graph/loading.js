import { SkeletonGraph } from '../components/LoadingStates';

export default function Loading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <SkeletonGraph />
    </div>
  );
}
