'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { Dataset } from '@/types/data';
import PuzzleGame from '@/components/PuzzleGame';

export default function PuzzlePage() {
  const params = useParams<{ slug: string }>();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!params.slug) return;

    fetch(`/api/data?name=${params.slug}`)
      .then((r: Response) => {
        if (!r.ok) {
          throw new Error('Puzzle not found.');
        }

        return r.json();
      })
      .then((data: Dataset) => {
        setDataset(data);
        setError('');
      })
      .catch(() => {
        setDataset(null);
        setError('Puzzle not found.');
      });
  }, [params.slug]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      {error ? (
        <Typography color="error">Puzzle not found.</Typography>
      ) : (
        <PuzzleGame dataset={dataset} />
      )}
    </Box>
  );
}