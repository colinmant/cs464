'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Dataset, DatasetMeta } from '@/types/data';
import DatasetPicker from '@/components/DatasetPicker';
import PuzzleGame from '@/components/PuzzleGame';

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

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <DatasetPicker
        selectedIndex={selectedIndex}
        datasetMeta={datasetMeta}
        onSelect={setSelectedIndex}
      />

      <PuzzleGame dataset={dataset} />
    </Box>
  );
}