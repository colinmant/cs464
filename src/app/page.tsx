'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Stack,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DataFile } from '@/types/data';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [datasets, setDatasets] = useState<DataFile[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(({ datasets }) => setDatasets(Object.values(datasets)));
  }, []);

  if (datasets.length === 0) return null;

  const { title, description, items } = datasets[selectedIndex];

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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>

      {/* Item cards */}
      <Stack spacing={1}>
        {items.map((item, index) => (
          <Card key={`${index}-${item.name}`} variant="outlined">
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
              <DragHandleIcon color="action" />
              <Typography variant="body1">{item.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
