import { DatasetItem } from "@/types/data";

export function getItemDirections(items: DatasetItem[]): Map<number, 'up' | 'down'> {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const directions = new Map<number, 'up' | 'down'>();
  items.forEach((item, currentIndex) => {
    const sortedIndex = sorted.findIndex((s) => s.order === item.order);
    if (sortedIndex < currentIndex) directions.set(currentIndex, 'up');
    else if (sortedIndex > currentIndex) directions.set(currentIndex, 'down');
  });
  return directions;
}
