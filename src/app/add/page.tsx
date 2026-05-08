'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, TextField, Button, IconButton, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+$/, '');
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    if ('errors' in error) return extractErrorMessage((error as Record<string, unknown>).errors);
    const entries = Object.entries(error as Record<string, unknown>);
    if (entries.length > 0) return entries.map(([k, v]) => `${k}: ${extractErrorMessage(v)}`).join(', ');
  }
  if (Array.isArray(error)) return error.map(extractErrorMessage).join(', ');
  return 'An unknown error occurred';
}

export default function AddDatasetPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState(['', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => setItems(prev => [...prev, '']);

  const handleItemChange = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSave = async () => {
    setError(null);

    const slug = slugify(title);
    const filledItems = items.filter(name => name.trim());

    if (!title.trim()) { setError('Dataset name is required'); return; }
    if (slug.length < 3) { setError('Dataset name must be at least 3 characters'); return; }
    if (filledItems.length < 2) { setError('At least 2 items are required'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: title.trim(),
          description: description.trim() || undefined,
          items: filledItems.map((name, index) => ({ name: name.trim(), order: index + 1 })),
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(extractErrorMessage(data.error));
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2, position: 'relative', pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton
          onClick={() => router.push('/')}
          aria-label="close"
        >
          <CloseIcon sx={{ fontSize: 36, fontWeight: 'bold' }} />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Data set name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          slotProps={{ input: { 'aria-label': 'dataset name' } }}
        />
      </Box>

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ width: 24, textAlign: 'right', flexShrink: 0, color: 'text.secondary' }}>
              {index + 1}
            </Typography>
            <TextField
              fullWidth
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={index === 0 ? '1st Item' : index === 1 ? '2nd Item' : index === 0 ? '3rd Item' : `${index + 1}th Item`}
              size="small"
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleAddItem} aria-label="add item">
          <AddIcon sx={{ fontSize: 52 }} />
        </IconButton>
        <Typography variant="body2" align="center">Add new item</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderColor: '#e89b00',
            color: '#e89b00',
            borderWidth: 2,
            fontWeight: 'bold',
            '&:hover': { borderColor: '#c47e00', color: '#c47e00', borderWidth: 2, bgcolor: 'transparent' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleSave}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderColor: '#3700cc',
            color: '#3700cc',
            borderWidth: 2,
            fontWeight: 'bold',
            '&:hover': { borderColor: '#2500aa', color: '#2500aa', borderWidth: 2, bgcolor: 'transparent' },
          }}
        >
          {loading ? 'Saving...' : 'SAVE'}
        </Button>
      </Box>
    </Box>
  );
}
