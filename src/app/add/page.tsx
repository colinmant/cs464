'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Divider, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddDataset() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([{ name: '' }]);

  const addItem = () => setItems([...items, { name: '' }]);

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index].name = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      border: '1px solid grey',
      borderRadius: 2,
      width: 450,
      maxWidth: '100%',
      mx: 'auto',
      mt: 6,
      p: 3,
    }}>
      <Typography variant="h5">Add a New Dataset</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
      />

      <Divider />

      <Typography variant="h6">Items</Typography>

      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ minWidth: 24, color: 'text.secondary' }}>
            {index + 1}.
          </Typography>
          <TextField
            label="Item name"
            value={item.name}
            onChange={(e) => updateItem(index, e.target.value)}
            fullWidth
            size="small"
          />
          {items.length > 1 && (
            <IconButton onClick={() => removeItem(index)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addItem}
        variant="outlined"
        size="small"
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Item
      </Button>

      <Button variant="contained" fullWidth>
        Submit
      </Button>
    </Box>
  );
}
