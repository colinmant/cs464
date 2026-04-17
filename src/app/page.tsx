'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Reorder } from 'motion/react';

// sample data
import birds from '../../data/bird_population.json';
import fish from '../../data/fish.json';
import planets from '../../data/planets.json';

import { DatasetResponse, DatasetItem } from '@/types/data';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const datasets: DatasetResponse[] = [birds, fish, planets]
  const { title, description, items } = datasets[selectedIndex];

  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);

  useEffect(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, [items]);

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

      {/* Title & description from the JSON */}
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>        {description}
      </Typography>

      {/* Item cards */}
      <Reorder.Group
        as="div"
        values={shuffledItems}
        onReorder={setShuffledItems}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {shuffledItems.map((item) => (
          <Reorder.Item
            key={item.name}
            value={item}
            as="div"
            style={{ position: 'relative', cursor: 'grab' }}
          >
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                <DragHandleIcon color="action" />
                <Typography variant="body1">{item.name}</Typography>
              </CardContent>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Box>
  );
};