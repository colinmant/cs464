import { useState } from 'react';
import { Reorder } from 'motion/react';
import { DatasetItem } from '@/types/data';
import DatasetItemCard from './DatasetItemCard';

interface DraggableDatasetItemsProps {
  shuffledItems: DatasetItem[];
  onReorder: (newOrder: DatasetItem[]) => void;
  getItemStatus: (item: DatasetItem, index: number) => 'correct' | 'close' | 'wrong' | 'default';
}

const statusColors = {
  correct: '#e6f4ea',
  close: '#fff9e6',
  wrong: '#f0f0f0',
  default: 'white',
};

export default function DraggableDatasetItems({ shuffledItems, onReorder, getItemStatus }: DraggableDatasetItemsProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Group
      as="div"
      values={shuffledItems}
      onReorder={onReorder}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {shuffledItems.map((item) => (
        <Reorder.Item
          key={item.order}
          value={item}
          as="div"
          style={{ position: 'relative' }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <DatasetItemCard
            item={item}
            isDragging={isDragging}
            statusColor={statusColors[getItemStatus(item, shuffledItems.indexOf(item))]}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}