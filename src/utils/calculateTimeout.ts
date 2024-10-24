export const calculateAnimationDuration = (
  maxX: number,
  speed: number = 8,
  fps: number = 60
): number => {
  const frames = maxX / speed
  const duration = (frames / fps) * 1000
  return duration
}
