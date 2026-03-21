import { ANIMATION_STEP, MS_PER_SECOND } from "@/constants/time";

export const calculateAnimationDuration = (
  maxX: number,
  speed: number = ANIMATION_STEP,
  fps: number = 60
): number => {
  const frames = maxX / speed;
  const duration = (frames / fps) * MS_PER_SECOND;

  return duration;
};
