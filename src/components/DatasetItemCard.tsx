import { Card, CardContent, Typography } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DatasetItem } from '@/types/data';

interface DatasetItemCardProps {
  item: DatasetItem;
  isDragging: boolean;
  statusColor: string;
}

export default function DatasetItemCard({ item, isDragging, statusColor }: DatasetItemCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: statusColor,
        transition: 'background-color 0.3s ease',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
        <DragHandleIcon color="action" />
        <Typography variant="body1">{item.name}</Typography>
      </CardContent>
    </Card>
  );
}