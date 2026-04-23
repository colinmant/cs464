'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Reorder } from 'motion/react';

import { Dataset, DatasetItem } from '@/types/data';
import { getItemDirections } from '@/lib/verifyOrder';

export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((json) => {
        const loaded: Dataset[] = Object.values(json.datasets);
        setDatasets(loaded);
      });
  }, []);

  useEffect(() => {
    if (datasets.length === 0) return;
    const items = datasets[selectedIndex].items;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setChecked(false);
  }, [datasets, selectedIndex]);

  const selected = datasets[selectedIndex];
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
          {datasets.map((ds, i) => (
            <MenuItem key={i} value={i}>{ds.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Title & description */}
      {selected && (
        <>
          <Typography variant="h4" gutterBottom>{selected.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {selected.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setChecked(true)}
            >
              Check Order
            </Button>
          </Box>
          {checked && directions.size === 0 && (
            <Typography color="success" sx={{ mb: 2, textAlign: 'center' }}>
              Congratulations, the order is correct!
            </Typography>
          )}
          {checked && directions.size > 0 && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {directions.size} {directions.size === 1 ? 'item is' : 'items are'} out of place
            </Typography>
          )}
        </>
      )}

      {/* Item cards */}
      <Reorder.Group
        as="div"
        values={shuffledItems}
        onReorder={setShuffledItems}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {shuffledItems.map((item, index) => (
          <Reorder.Item
            key={item.name}
            value={item}
            as="div"
            style={{ position: 'relative' }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            <Card variant="outlined" sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                <DragHandleIcon color="action"/>
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
