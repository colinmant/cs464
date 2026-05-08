import { Typography } from '@mui/material';
import { Dataset } from '@/types/data';

interface DatasetHeaderProps {
  dataset: Dataset | null;
}

export default function DatasetHeader({ dataset }: DatasetHeaderProps) {
  if (!dataset) {
    return <h3> loading... </h3>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {dataset.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {dataset.description}
      </Typography>
    </>
  );
}