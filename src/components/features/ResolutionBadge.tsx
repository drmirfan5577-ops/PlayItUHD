import { RESOLUTION_BADGES } from '@/constants/mediaFormats';
import type { VideoResolution } from '@/types/media';

interface ResolutionBadgeProps {
  resolution: VideoResolution;
  size?: 'sm' | 'md' | 'lg';
}

export default function ResolutionBadge({ resolution, size = 'md' }: ResolutionBadgeProps) {
  const badge = RESOLUTION_BADGES[resolution] || RESOLUTION_BADGES['Unknown'];
  const sizeClass = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-[10px] px-2 py-0.5';

  return (
    <span className={`inline-flex items-center font-bold rounded-md bg-gradient-to-r ${badge.color} text-white ${sizeClass} shadow-md ${badge.glow}`}>
      {resolution}
    </span>
  );
}
