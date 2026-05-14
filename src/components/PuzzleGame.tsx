'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Dataset, DatasetItem } from '@/types/data';
import FeedbackAlert from '@/components/FeedbackAlert';
import DatasetHeader from '@/components/DatasetHeader';
import DraggableDatasetItems from '@/components/DraggableDatasetItems';

type PuzzleGameProps = {
  dataset: Dataset | null;
};

export default function PuzzleGame({ dataset }: PuzzleGameProps) {
  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'info';
    message: string;
  } | null>(null);

  const getItemStatus = (item: DatasetItem, index: number) => {
    if (!feedback) return 'default';
    const diff = Math.abs(item.order - (index + 1));
    if (diff === 0) return 'correct';
    if (diff <= 2) return 'close';
    return 'wrong';
  };

  useEffect(() => {
    if (dataset) {
      const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setFeedback(null);
    }
  }, [dataset]);

  const handleCheckOrder = () => {
    if (dataset) {
      const correctCount = shuffledItems.reduce((count, item, index) => {
        return item.name === dataset.items[index].name ? count + 1 : count;
      }, 0);

      if (correctCount === dataset.items.length) {
        setFeedback({
          severity: 'success',
          message: 'Correct! You solved the puzzle.',
        });
      } else {
        setFeedback({
          severity: 'info',
          message: `${correctCount} of ${dataset.items.length} items are in the correct position.`,
        });
      }
    }
  };

  const handleReorder = (newOrder: DatasetItem[]) => {
    setShuffledItems(newOrder);
    setFeedback(null);
  };

  return (
    <>
      <Button variant="contained" onClick={handleCheckOrder} sx={{ mb: 2 }}>
        Check Order
      </Button>

      <FeedbackAlert feedback={feedback} />
      <DatasetHeader dataset={dataset} />
      <DraggableDatasetItems
        shuffledItems={shuffledItems}
        onReorder={handleReorder}
        getItemStatus={getItemStatus}
      />
    </>
  );
}