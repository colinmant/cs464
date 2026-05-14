'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Dataset, DatasetMeta } from '@/types/data';
import DatasetPicker from '@/components/DatasetPicker';
import PuzzleGame from '@/components/PuzzleGame';
import Link from 'next/link';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta[]>([]);

  useEffect(() => {
    fetch('/api/titles')
      .then((r: Response) => r.json())
      .then((data: DatasetMeta[]) => setDatasetMeta(data));
  }, []);

  useEffect(() => {
    if (datasetMeta.length > selectedIndex) {
      fetch(`/api/data?name=${datasetMeta[selectedIndex].dataset_slug}`)
        .then((r: Response) => r.json())
        .then((data: Dataset) => setDataset(data));
    }
  }, [selectedIndex, datasetMeta]);

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

  const handleShuffleData = () => {
    if (dataset) {
      const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setFeedback(null);
    }
  };

  const handleReorder = (newOrder: DatasetItem[]) => {
    setShuffledItems(newOrder);
    setFeedback(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <DatasetPicker
        selectedIndex={selectedIndex}
        datasetMeta={datasetMeta}
        onSelect={setSelectedIndex}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={handleCheckOrder}>
          Check Order
        </Button>
        <Button variant="contained" onClick={handleShuffleData}>
          Shuffle
        </Button>
        <Button variant="contained" component={Link} href="/add">
          Add New Dataset
        </Button>
      </Box>

      <FeedbackAlert feedback={feedback} />
      <DatasetHeader dataset={dataset} />
      <DraggableDatasetItems
        shuffledItems={shuffledItems}
        onReorder={handleReorder}
        getItemStatus={getItemStatus}
      />
    </Box>
  );
}