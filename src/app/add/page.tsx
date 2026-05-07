'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Divider, IconButton, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddDataset() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([{ name: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addItem = () => setItems([...items, { name: '' }]);

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index].name = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    const body = {
      slug,
      title,
      description,
      items: items.map((item, i) => ({ name: item.name, order: i + 1 })),
    };

    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? 'Something went wrong');
    } else {
      setSuccess(true);
      setTitle('');
      setSlug('');
      setDescription('');
      setItems([{ name: '' }]);
    }
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

      {error && <Alert severity="error">{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}
      {success && <Alert severity="success">Dataset created successfully!</Alert>}

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <TextField
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        fullWidth
        helperText="Lowercase letters, numbers, and hyphens only (e.g. my-dataset)"
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

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
