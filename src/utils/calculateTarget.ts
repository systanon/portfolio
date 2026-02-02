/**
 * Calculates the target point of movement based on angle and distance
 * @param startX - starting X coordinate
 * @param startY - starting Y coordinate
 * @param angle - angle in degrees (0° = right, 90° = down)
 * @param minDistance - minimum distance to travel
 * @param maxDistance - maximum distance to travel
 * @returns { x: number, y: number }
 */

export function calculateTarget(
  startX: number,
  startY: number,
  angle: number,
  minDistance = 800,
  maxDistance = 1000,
) {
  const distance = minDistance + Math.random() * (maxDistance - minDistance)
  const rad = (angle * Math.PI) / 180
  const x = startX + Math.cos(rad) * distance
  const y = startY + Math.sin(rad) * distance

  return { x, y }
}
