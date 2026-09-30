export function clampPosition(position, size, area, reservedBottom) {
  if (!area || area.width === 0) return position
  const width = Math.min(size.width, area.width)
  const height = Math.min(size.height, area.height - reservedBottom)
  const maxX = Math.max(0, area.width - width)
  const maxY = Math.max(0, area.height - reservedBottom - height)
  return {
    x: Math.min(Math.max(0, position.x), maxX),
    y: Math.min(Math.max(0, position.y), maxY),
  }
}
