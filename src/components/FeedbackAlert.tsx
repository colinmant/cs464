import { Box, Alert } from '@mui/material';

interface FeedbackAlertProps {
  feedback: {
    severity: 'success' | 'info';
    message: string;
  } | null;
}

export default function FeedbackAlert({ feedback }: FeedbackAlertProps) {
  return (
    <Box sx={{ minHeight: 48, mb: 3 }}>
      {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}
    </Box>
  );
}