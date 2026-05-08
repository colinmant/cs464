import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatasetMeta } from '@/types/data';

interface DatasetPickerProps {
  selectedIndex: number;
  datasetMeta: DatasetMeta[];
  onSelect: (value: number) => void;
}

export default function DatasetPicker({ selectedIndex, datasetMeta, onSelect }: DatasetPickerProps) {
  const value = datasetMeta.length > 0 ? selectedIndex : '';
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Select a dataset</InputLabel>
      <Select
        value={value}
        label="Select a dataset"
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        {datasetMeta.map((ds, i) => (
          <MenuItem key={i} value={i}>
            {ds.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}