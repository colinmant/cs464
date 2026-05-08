import { DatasetItem } from '@/types/data';

export type ItemStatus = 'correct' | 'close' | 'wrong' | 'default';

export const statusColors: Record<ItemStatus, string> = {
  correct: '#e6f4ea',
  close: '#fff9e6',
  wrong: '#f0f0f0',
  default: 'white',
};

export function getItemStatus(
  item: DatasetItem,
  index: number,
  hasFeedback: boolean
): ItemStatus {
  if (!hasFeedback) return 'default';

  const diff = Math.abs(item.order - (index + 1));

  if (diff === 0) return 'correct';
  if (diff <= 2) return 'close';

  return 'wrong';
}

export function shuffleItems(items: DatasetItem[]): DatasetItem[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function countCorrectItems(
  shuffledItems: DatasetItem[],
  correctItems: DatasetItem[]
): number {
  return shuffledItems.reduce((count, item, index) => {
    return item.name === correctItems[index].name ? count + 1 : count;
  }, 0);
}