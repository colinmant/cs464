'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel,
  Button, Alert
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Reorder } from 'motion/react';

import { Dataset, DatasetItem, DatasetMeta } from '@/types/data';
import { getItemDirections } from '@/lib/verifyOrder';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta[]>([]);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'info';
    message: string;
  } | null>(null);

  const statusColors = {
    correct: '#e6f4ea',
    close: '#fff9e6',
    wrong: '#f0f0f0',
    default: 'white',
  };

  const getItemStatus = (item: DatasetItem, index: number) => {
    if (!feedback) return 'default';
    const diff = Math.abs(item.order - (index + 1));
    if (diff === 0) return 'correct';
    if (diff <= 2) return 'close';
    return 'wrong';
  };

  useEffect(() => {
    fetch('/api/titles')
      .then((r) => r.json())
      .then((data: DatasetMeta[]) => setDatasetMeta(data));
  }, []);

  useEffect(() => {
    if (datasetMeta.length > selectedIndex) {
      setDataset(null);
      setShuffledItems([]);
      const controller = new AbortController();
      fetch(`/api/data?name=${datasetMeta[selectedIndex].dataset_slug}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data: Dataset) => setDataset(data))
        .catch(() => {});
      return () => controller.abort();
    }
  }, [selectedIndex, datasetMeta]);

  useEffect(() => {
    if (dataset) {
      const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setFeedback(null);
      setChecked(false);
    }
  }, [dataset]);

  const computeFeedback = (items: DatasetItem[], ds: Dataset) => {
    const correctCount = items.reduce((count, item, index) => {
      return item.name === ds.items[index].name ? count + 1 : count;
    }, 0);

    if (correctCount === ds.items.length) {
      setFeedback({ severity: 'success', message: 'Correct! You solved the puzzle.' });
    } else {
      setFeedback({ severity: 'info', message: `${correctCount} of ${ds.items.length} items are in the correct position.` });
    }
  };

  const handleCheckOrder = () => {
    if (!dataset) return;
    setChecked(true);
    computeFeedback(shuffledItems, dataset);
  };

  useEffect(() => {
    if (checked && dataset) computeFeedback(shuffledItems, dataset);
  }, [shuffledItems]);

  const handleReorder = (newOrder: DatasetItem[]) => {
    setShuffledItems(newOrder);
  };

  const directions = getItemDirections(shuffledItems);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>

      {/* Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select a dataset</InputLabel>
        <Select
          value={selectedIndex}
          label="Select a dataset"
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {datasetMeta.map((ds, i) => (
            <MenuItem key={i} value={i}>{ds.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Title & description */}
      {dataset ? (
        <>
          <Typography variant="h4" gutterBottom>{dataset.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {dataset.description}
          </Typography>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}

      {/* Check order button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button variant="contained" color="success" onClick={handleCheckOrder}>
          Check Order
        </Button>
      </Box>

      {/* Feedback */}
      <Box sx={{ minHeight: 48, mb: 3 }}>
        {feedback && (
          <Alert severity={feedback.severity}>{feedback.message}</Alert>
        )}
      </Box>

      {/* Item cards */}
      <Reorder.Group
        as="div"
        values={shuffledItems}
        onReorder={handleReorder}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {shuffledItems.map((item, index) => (
          <Reorder.Item
            key={item.order}
            value={item}
            as="div"
            style={{ position: 'relative' }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            <Card
              variant="outlined"
              sx={{
                cursor: isDragging ? 'grabbing' : 'grab',
                backgroundColor: statusColors[getItemStatus(item, shuffledItems.indexOf(item))],
                transition: 'background-color 0.3s ease',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                <DragHandleIcon color="action" />
                <Typography variant="body1" sx={{ flex: 1 }}>{item.name}</Typography>
                {checked && directions.get(index) === 'up' && <ArrowUpwardIcon color="error" />}
                {checked && directions.get(index) === 'down' && <ArrowDownwardIcon color="error" />}
              </CardContent>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Box>
  );
};
